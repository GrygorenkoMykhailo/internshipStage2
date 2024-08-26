import createServer from "./createServer";
import dbConnection from "./dbConnection";

function boot(){   
    dbConnection();
    const server = createServer();
    server.listen(process.env.PORT, () => {
        console.log('Server started at port ', process.env.PORT);
    });
}

boot();