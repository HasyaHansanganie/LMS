import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import axios from "axios";
import { getCroppedImg } from "../../utils/cropImage";
import defaultProfile from "../../default_logo.svg";

function UploadProfile({ email, onClose, onUploadSuccess }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [existingProfile, setExistingProfile] = useState(null);
    const [hasExistingProfile, setHasExistingProfile] = useState(false);

    useEffect(() => {
        const profilePath = `http://localhost:5000/userProfiles/${email}.jpg`;
        const img = new Image();
    
        img.src = profilePath;
        img.onload = () => {
            setHasExistingProfile(true);
            setImageSrc(profilePath);
        };
        img.onerror = () => {
            setHasExistingProfile(false);
            setImageSrc(null);
        };
    }, [email]);
    


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleUpload = async () => {
        try {
            const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels);
            const formData = new FormData();
            formData.append("image", croppedImageFile);
            formData.append("email", email);

            await axios.post(`http://localhost:5000/profile/upload_profile?email=${email}`, formData);
            onUploadSuccess();
            onClose();
        } catch (err) {
            console.error("Upload failed:", err);
        }
    };

    return (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "500px", width: "100%" }}>
                <div className="modal-content p-3">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold" style={{ color: "rgb(37, 73, 106)" }}>
                            Update Profile Picture
                        </h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body text-center">
                        {imageSrc ? (
                            <>
                                <div
                                    style={{
                                        position: "relative",
                                        width: "100%",
                                        height: 200,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "50%",
                                            height: 200,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Cropper
                                            image={imageSrc}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            cropShape="round"
                                            showGrid={false}
                                            onCropChange={setCrop}
                                            onZoomChange={setZoom}
                                            onCropComplete={onCropComplete}
                                        />
                                    </div>
                                </div>

                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(e.target.value)}
                                    className="form-range my-3"
                                />
                            </>
                        ) : (
                            <img
                                src={defaultProfile}
                                alt="Preview"
                                className="rounded-circle mb-3"
                                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                            />
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-control my-3"
                        />

                        <button
                            className="btn btn-primary rounded-5"
                            style={{ backgroundColor: "rgba(37, 73, 106)", width: "120px" }}
                            onClick={handleUpload}
                            disabled={!imageSrc} // disable if no image to crop
                        >
                            {hasExistingProfile ? "Save" : "Update"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default UploadProfile;
