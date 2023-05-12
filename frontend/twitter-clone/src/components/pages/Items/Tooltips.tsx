import { Box, IconButton, Tooltip } from "@mui/material";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";

type TooltipsProps = {
	fontSize: string;
};

const Tooltips = ({ fontSize }: TooltipsProps) => {
	return (
		<>
			<Tooltip title="Reply">
				<IconButton>
					<ModeCommentOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
			</Tooltip>
			<Tooltip title="Retweet">
				<IconButton>
					<RepeatOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
			</Tooltip>
			<Tooltip title="Like">
				<IconButton>
					<FavoriteBorderOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
			</Tooltip>
			<Tooltip title="Share">
				<IconButton>
					<IosShareOutlinedIcon sx={{ fontSize: fontSize }} />
				</IconButton>
			</Tooltip>
		</>
	);
};

export default Tooltips;
