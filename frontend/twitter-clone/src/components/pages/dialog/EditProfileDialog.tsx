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
import { useState } from "react";

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL as string;

type EditProfileDialogProps = {
	open: boolean;
	onClose: () => void;
};

const EditProfileDialog = ({ open, onClose }: EditProfileDialogProps) => {
	const { user } = useUserContext();
	const [loading, setLoading] = useState<boolean>(false);
	const [profileName, setProfileName] = useState<string | undefined>(
		user?.profileName
	);
	const [description, setDescription] = useState<string | undefined>(
		user?.description
	);
	return (
		<Dialog open={open} onClose={onClose}>
			<Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
				<Box sx={{ display: "flex" }}>
					<IconButton onClick={onClose}>
						<CloseIcon />
					</IconButton>
					<Typography mt={1} sx={{ fontWeight: "bold" }}>
						Edit Profile
					</Typography>
				</Box>
				<Box>
					<LoadingButton
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
				<Box component="form" sx={{ mb: 3 }}>
					<Box
						sx={{
							backgroundImage: `url(${IMAGE_URL + user?.profileImg})`,
							width: "100%",
							height: "150px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Tooltip title="Add photo" enterDelay={800}>
							<IconButton
								aria-label="upload picture"
								component="label"
								sx={{
									color: "#c7c5c5",
									background: "rgba(15, 20, 25, 0.75)",
									":hover": {
										background: "rgba(15, 20, 25, 0.75)",
										opacity: 0.7,
									},
								}}
							>
								<input hidden accept="image/*" type="file" />
								<AddAPhotoIcon />
							</IconButton>
						</Tooltip>
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
						<Tooltip title="Add photo" enterDelay={800}>
							<IconButton
								aria-label="upload picture"
								component="label"
								sx={{
									color: "#c7c5c5",
									background: "rgba(15, 20, 25, 0.75)",
									":hover": {
										background: "rgba(15, 20, 25, 0.75)",
										opacity: 0.7,
									},
									position: "absolute",
									top: 185,
									left: 55,
								}}
							>
								<input hidden accept="image/*" type="file" />
								<AddAPhotoIcon />
							</IconButton>
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
							// error={usernameOrEmailErrMsg !== ""}
							// helperText={usernameOrEmailErrMsg}
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
							// error={usernameOrEmailErrMsg !== ""}
							// helperText={usernameOrEmailErrMsg}
						/>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default EditProfileDialog;
