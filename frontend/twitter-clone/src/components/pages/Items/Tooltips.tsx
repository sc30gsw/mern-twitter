import { Box, IconButton, Tooltip } from "@mui/material";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";

type TooltipsProps = {
	fontSize: string;
	color: string;
};

const Tooltips = ({ fontSize, color }: TooltipsProps) => {
	return (
		<>
			<Tooltip title="Reply">
				<IconButton sx={{ color: color }}>
					<ModeCommentOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
			</Tooltip>
			<Tooltip title="Retweet">
				<IconButton sx={{ color: color }}>
					<RepeatOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
			</Tooltip>
			<Tooltip title="Like">
				<IconButton sx={{ color: color }}>
					<FavoriteBorderOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
			</Tooltip>
			<Tooltip title="Share">
				<IconButton sx={{ color: color }}>
					<IosShareOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
			</Tooltip>
		</>
	);
};

export default Tooltips;
