import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import { AdminPage, AuthPage, FavoritesPage, IndexPage, ProductPage, ProductsPage, ProfilePage } from "./pages";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AdminEditProductComponent, AdminProductListComponent, BootComponent, CreateProductComponent, UserListComponent } from "./components";

const router = createBrowserRouter(createRoutesFromElements(
<Route>
  <Route path="/" element={<IndexPage/>}></Route>
  <Route path="/auth" element={<AuthPage/>}></Route>
  <Route path="/profile" element={<ProfilePage/>}></Route>
  <Route path="/products" element={<ProductsPage/>}></Route>
  <Route path="/favorites" element={<FavoritesPage/>}></Route>
  <Route path="/product/:id" element={<ProductPage/>}></Route>
  <Route path="/admin" element={<AdminPage/>}>
    <Route path="products" element={<AdminProductListComponent/>}></Route>
    <Route path="products/create" element={<CreateProductComponent/>}></Route>
    <Route path="products/edit/:id" element={<AdminEditProductComponent/>}></Route>
    <Route path="users" element={<UserListComponent/>}></Route>
  </Route>
</Route>
));

function App() {
  return (
    <Provider store={store}>
      <BootComponent/>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
