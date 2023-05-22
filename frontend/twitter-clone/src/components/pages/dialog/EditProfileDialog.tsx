import {
	Avatar,
	Box,
	Dialog,
	DialogContent,
	IconButton,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useUserContext } from "../../../contexts/UserProvider";
import CloseIcon from "@mui/icons-material/Close";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import React, { useState } from "react";
import EditConfirmDialog from "./EditConfirmDialog";
import authApi from "../../../api/authApi";

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL as string;

type EditProfileDialogProps = {
	open: boolean;
	onClose: () => void;
};

const EditProfileDialog = ({ open, onClose }: EditProfileDialogProps) => {
	const { user, setUser } = useUserContext();
	const [loading, setLoading] = useState<boolean>(false);
	const [profileName, setProfileName] = useState<string | undefined>(
		user?.profileName
	);
	const [description, setDescription] = useState<string | undefined>(
		user?.description
	);
	const [profileNameErrMsg, setProfileNameErrMsg] = useState<string>("");
	const [descriptionErrMsg, setDescriptionErrMsg] = useState<string>("");
	const [charCount, setCharCount] = useState<number>(
		user?.description.length as number
	);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [isRemove, setIsRemove] = useState<boolean>(false);
	const [profileImg, setProfileImg] = useState<File | null>(null);
	const [profileImgPreview, setProfileImgPreview] = useState<string>("");
	const [icon, setIcon] = useState<File | null>(null);
	const [iconPreview, setIconPreview] = useState<string>("");
	const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

	const handleProfileImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsEdit(true);
		if (e.target.files) {
			const file = e.target.files[0];
			setProfileImg(file);
			setProfileImgPreview(URL.createObjectURL(file));
		}
	};

	const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsEdit(true);
		if (e.target.files) {
			const file = e.target.files[0];
			setIcon(file);
			setIconPreview(URL.createObjectURL(file));
		}
	};

	const handleConfirmOpen = () => setConfirmOpen(true);
	const confirmClose = () => setConfirmOpen(false);
	const discard = () => {
		setConfirmOpen(false);
		onClose();
		setProfileName(user?.profileName);
		setProfileNameErrMsg("");
		setDescription(user?.description);
		setDescriptionErrMsg("");
		setProfileImg(null);
		setProfileImgPreview("");
		setIcon(null);
		setIconPreview("");
		setCharCount(0);
		setIsEdit(false);
		setIsRemove(false);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		// バリデーション
		let err = false;

		if (!profileName) {
			err = true;
			setProfileNameErrMsg("名前を入力してください");
		} else if (profileName.length < 8) {
			err = true;
			setProfileNameErrMsg("名前は8文字以上で入力してください");
		}

		if (charCount > 160) {
			err = true;
			setDescriptionErrMsg("自己紹介は160文字以内で入力してください");
		}

		if (err) return setLoading(false);

		const formData = new FormData();

		const removeFlg = isRemove ? "1" : "0";

		if (profileName) {
			formData.append("profileName", profileName);
		}

		if (description) {
			formData.append("description", description);
		}

		if (profileImg !== null) {
			formData.append("profileImg", profileImg);
		}

		if (icon !== null) {
			formData.append("icon", icon);
		}

		formData.append("isRemove", removeFlg);

		try {
			const res = await authApi.update(user?._id as string, formData);

			setUser(res.data.updatedUser);
			console.log("ユーザー更新に成功しました");
			onClose();
			setLoading(false);
			setProfileName(res.data.updatedUser.profileName);
			setProfileNameErrMsg("");
			setDescription(res.data.updatedUser.description);
			setDescriptionErrMsg("");
			setProfileImgPreview("");
			setIconPreview("");
			setCharCount(res.data.updatedUser.description.length);
			setIsEdit(false);
			setIsRemove(false);
		} catch (err) {
			console.log(err);
		}
	};

	const onCloseExtraFunc = () => {
		setIsRemove(false);
		onClose();
	};

	return (
		<>
			<Dialog open={open} onClose={onCloseExtraFunc}>
				<Box
					component="form"
					encType="multipart/form-data"
					noValidate
					onSubmit={handleSubmit}
				>
					<Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
						<Box sx={{ display: "flex" }}>
							<IconButton
								onClick={isEdit ? handleConfirmOpen : onCloseExtraFunc}
							>
								<CloseIcon />
							</IconButton>
							<Typography mt={1} sx={{ fontWeight: "bold" }}>
								Edit Profile
							</Typography>
						</Box>
						<Box>
							<LoadingButton
								type="submit"
								variant="outlined"
								size="small"
								loading={loading}
								sx={{
									textTransform: "none",
									float: "right",
									mr: 1,
									mt: "5px",
									borderRadius: "30px",
									background: "rgb(15, 20, 25)",
									color: "white",
									fontWeight: "bold",
									border: "solid 1px black",
									":hover": {
										background: "rgb(15, 20, 25)",
										border: "solid 1px black",
										opacity: 0.7,
									},
								}}
							>
								Save
							</LoadingButton>
						</Box>
					</Box>
					<DialogContent sx={{ width: "600px" }}>
						<Box sx={{ mb: 3 }}>
							<Box
								sx={{
									width: "100%",
									height: "150px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Box>
									<Tooltip title="Add photo" enterDelay={800}>
										<IconButton
											aria-label="upload picture"
											component="label"
											htmlFor="profileImg"
											sx={{
												color: "#c7c5c5",
												background: "rgba(15, 20, 25, 0.75)",
												opacity: 0.7,
												zIndex: 1,
												":hover": {
													background: "rgba(15, 20, 25, 0.75)",
													opacity: 0.5,
												},
											}}
										>
											<input
												type="file"
												id="profileImg"
												name="profileImg"
												accept="image/png image/jpeg audio/mpeg"
												multiple
												style={{ display: "none" }}
												onChange={handleProfileImgChange}
											/>
											<AddAPhotoIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Remove photo" enterDelay={800}>
										<IconButton
											sx={{
												ml: "20px",
												color: "#c7c5c5",
												background: "rgba(15, 20, 25, 0.75)",
												opacity: 0.7,
												zIndex: 1,
												":hover": {
													background: "rgba(15, 20, 25, 0.75)",
													opacity: 0.5,
												},
											}}
											onClick={() => {
												setIsEdit(true);
												setProfileImgPreview("");
												setIsRemove(true);
											}}
										>
											<CloseIcon />
										</IconButton>
									</Tooltip>
									{profileImgPreview && (
										<img
											src={profileImgPreview}
											alt={`profile_image_${profileImgPreview}`}
											width="580px"
											height="130px"
											style={{
												position: "absolute",
												top: 80,
												left: 10,
												objectFit: "cover",
												opacity: 0.8,
											}}
										/>
									)}
									{isRemove ? (
										<></>
									) : user?.profileImg && !profileImgPreview ? (
										<img
											src={IMAGE_URL + user?.profileImg}
											alt={user?.profileImg}
											width="580px"
											height="130px"
											style={{
												position: "absolute",
												top: 80,
												left: 10,
												objectFit: "cover",
												opacity: 0.8,
											}}
										/>
									) : (
										<></>
									)}
								</Box>
								{!iconPreview && (
									<Avatar
										src={IMAGE_URL + user?.icon}
										alt={user?.profileName}
										sx={{
											width: 70,
											height: 70,
											position: "absolute",
											top: 170,
											left: 40,
										}}
									/>
								)}
								<Tooltip title="Add photo" enterDelay={800}>
									<>
										<IconButton
											aria-label="upload picture"
											component="label"
											htmlFor="icon"
											sx={{
												color: "#c7c5c5",
												background: "rgba(15, 20, 25, 0.75)",
												position: "absolute",
												opacity: 0.7,
												top: 185,
												left: 55,
												zIndex: 1,
												":hover": {
													background: "rgba(15, 20, 25, 0.75)",
													opacity: 0.5,
												},
											}}
										>
											<input
												type="file"
												id="icon"
												name="icon"
												accept="image/png image/jpeg audio/mpeg"
												multiple
												style={{ display: "none" }}
												onChange={handleIconChange}
											/>
											<AddAPhotoIcon />
										</IconButton>
										{iconPreview && (
											<img
												src={iconPreview}
												alt={`icon_${iconPreview}`}
												width="70px"
												height="70px"
												style={{
													border: "5px solid white",
													objectFit: "cover",
													position: "absolute",
													top: 170,
													left: 40,
													opacity: 0.8,
													borderRadius: "50%",
												}}
											/>
										)}
									</>
								</Tooltip>
							</Box>
							<Box sx={{ mt: 4, ml: 1, textAlign: "left" }}>
								<TextField
									fullWidth
									id="profileName"
									name="profileName"
									value={profileName}
									label="Name"
									margin="normal"
									onChange={(e) => {
										setIsEdit(true);
										setProfileName(e.target.value);
									}}
									error={profileNameErrMsg !== ""}
									helperText={profileNameErrMsg}
								/>
								<TextField
									fullWidth
									id="description"
									name="description"
									value={description}
									label="Bio"
									margin="normal"
									multiline
									rows={4}
									onFocus={() => setIsFocused(true)}
									onBlur={() => setIsFocused(false)}
									onChange={(e) => {
										setIsEdit(true);
										setDescription(e.target.value);
										setCharCount(e.target.value.length);
									}}
									error={descriptionErrMsg !== ""}
									helperText={
										descriptionErrMsg
											? descriptionErrMsg
											: isFocused
											? `${charCount}/160`
											: ""
									}
									inputProps={{ maxLength: 160 }}
								/>
							</Box>
						</Box>
					</DialogContent>
				</Box>
			</Dialog>
			<EditConfirmDialog
				open={confirmOpen}
				onClose={confirmClose}
				discard={discard}
			/>
		</>
	);
};

export default EditProfileDialog;
