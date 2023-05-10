import { Box, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { TwitterTimelineEmbed } from "react-twitter-embed";

const Widgets = () => {
	return (
		<Box sx={{ ml: "10px", mt: "10px" }}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					borderRadius: "25px",
					backgroundColor: "#EBEEF0",
					width: "100%",
					paddingLeft: "10px",
					mb: "20px",
				}}
			>
				<SearchIcon color="action" />
				<InputBase
					placeholder="ツイート検索"
					sx={{
						color: "inherit",
						marginLeft: "5px",
						flex: 1,
					}}
				/>
			</Box>
			<TwitterTimelineEmbed
				sourceType="profile"
				screenName="cu30rry_"
				options={{ height: "700px" }}
			/>
		</Box>
	);
};

export default Widgets;
