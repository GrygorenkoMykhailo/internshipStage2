import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FooterComponent, HeaderComponent, SideBarComponent, TextInputComponent } from "../../components";
import { useForm, SubmitHandler } from "react-hook-form";
import { RootState } from "../../redux/store";
import axios from "axios";
import { useAppSelector } from "../../hooks/useAppSelector";
import { ProfileDAO } from "../../types";
import { useDispatch } from "react-redux";
import { setProfile } from "../../redux/profileSlice";

interface ProfilePageForm {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    newPassword?: string;
    confirmNewPassword?: string;
    receiveUpdates?: boolean;
    profileImage?: FileList;
}

export const ProfilePage = () => {
    const profilePageForm = useForm<ProfilePageForm>();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const profile = useAppSelector(state => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { email, firstName, lastName, phoneNumber, receiveUpdates, imagePath, status, isAuthenticated } = useSelector((state: RootState) => state.profile);

    useEffect(() => {
        if (status === 'rejected' || isAuthenticated === false) {
            navigate('/auth');
        }
    }, [status, navigate, isAuthenticated]);

    useEffect(() => {
        profilePageForm.setValue("firstName", firstName);
        profilePageForm.setValue("lastName", lastName);
        profilePageForm.setValue("email", email);
        profilePageForm.setValue("phoneNumber", phoneNumber || "");
        profilePageForm.setValue("receiveUpdates", receiveUpdates);

        if (imagePath) {   
            setPreviewImage(import.meta.env.VITE_BASE_URL + imagePath);
        }
    }, [profilePageForm, firstName, lastName, email, phoneNumber, receiveUpdates, imagePath]);

    const onSubmit: SubmitHandler<ProfilePageForm> = async (data) => {
        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("newPassword", data.newPassword || '');
        formData.append("confirmNewPassword", data.confirmNewPassword || '');
        formData.append("receiveUpdates", data.receiveUpdates ? "true" : "false");

        if (data.profileImage && data.profileImage.length > 0) {
            formData.append("profileImage", data.profileImage[0]);
        }

        try {
            const response = await axios.put(import.meta.env.VITE_BASE_URL + "/updateProfile", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const data = response.data as ProfileDAO;
            dispatch(setProfile(data));
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && event.target.files) {
            setPreviewImage(URL.createObjectURL(file));
            profilePageForm.setValue("profileImage", event.target.files);
        }
    };

    return (
        <div>
            <HeaderComponent />
            <div className="flex min-h-screen bg-lightGray">
                <SideBarComponent />
                <div className="flex-grow flex items-center justify-center ml-28">
                    <div className="bg-white flex flex-col items-center w-4/5 rounded-xl p-8 shadow-lg">
                        <h2 className="text-center text-3xl font-bold mb-6">Account Settings</h2>
                        <div className="flex w-full space-x-8">
                            <div className="flex flex-col justify-center items-center w-1/2">
                                <img
                                    src={previewImage || import.meta.env.VITE_BASE_URL + profile.imagePath}
                                    alt="Profile"
                                    className="w-1/2 h-1/2 object-cover mb-4 rounded-full"
                                />
                                <label className="mt-2 px-4 py-2 w-96 bg-white text-violet rounded-md border border-black font-bold text-xl cursor-pointer text-center">
                                    Change Photo
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>

                            <form className="flex flex-col w-1/2 p-6" onSubmit={profilePageForm.handleSubmit(onSubmit)}>
                                <TextInputComponent form={profilePageForm} label="First Name" name="firstName" type="text" />
                                <TextInputComponent form={profilePageForm} label="Last Name" name="lastName" type="text" />
                                <TextInputComponent form={profilePageForm} label="Email Address" name="email" type="text" />
                                <TextInputComponent form={profilePageForm} label="Phone" name="phoneNumber" type="text" />
                                <TextInputComponent form={profilePageForm} label="New Password" name="newPassword" type="password" />
                                <TextInputComponent form={profilePageForm} label="Confirm New Password" name="confirmNewPassword" type="password" />
                                <div className="flex items-center mb-4 self-center">
                                    <input type="checkbox" id="getUpdates" {...profilePageForm.register("receiveUpdates")} />
                                    <label htmlFor="getUpdates" className="pl-2 text-sm text-violet">
                                        Get updates on our shop news and promotions
                                    </label>
                                </div>
                                <button className="px-4 py-2 bg-violet text-white rounded-md hover:bg-violet-dark transition font-bold text-xl">
                                    Save All Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
};
