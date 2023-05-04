import { Box, Typography, List, IconButton } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";

const TweetList = () => {
	return (
		<Box sx={{ mt: "10px", borderTop: "solid 1px #657786" }}>
			<List sx={{ width: "100%", bgcolor: "background.paper" }}>
				<ListItem alignItems="flex-start">
					<ListItemAvatar>
						<IconButton>
							<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
						</IconButton>
					</ListItemAvatar>
					<Box sx={{ flexGrow: 1, mt: "20px" }}>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Typography
								sx={{
									fontWeight: "bold",
									":hover": { textDecoration: "underline" },
								}}
								component="span"
								variant="body2"
								color="text.primary"
							>
								<Link to="/" style={{ color: "black", textDecoration: "none" }}>
									UserName
								</Link>
							</Typography>
							<Typography
								sx={{ ml: "10px" }}
								component="span"
								variant="body2"
								color="text.primary"
							>
								2023/5/4
							</Typography>
						</Box>
						<Typography>
							ChatGPTを子供が使うデメリットを具体的に提示出来ないのに禁止しようとする。12歳という年齢を選んだ理由も無し。
							新技術を調べもせずに「わからないから不安。だから禁止」
							根拠無く子供に制限を加えようとする暴論を批判せずに受け入れる社会に未来は無いかなぁ、、と
						</Typography>
					</Box>
				</ListItem>
				<Divider variant="inset" component="li" />
				<ListItem alignItems="flex-start">
					<ListItemAvatar>
						<Avatar alt="Emy Sharp" src="/static/images/avatar/1.jpg" />
					</ListItemAvatar>
					<Box sx={{ flexGrow: 1 }}>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Typography
								sx={{ fontWeight: "bold" }}
								component="span"
								variant="body2"
								color="text.primary"
							>
								UserName
							</Typography>
							<Typography
								sx={{ ml: "10px" }}
								component="span"
								variant="body2"
								color="text.primary"
							>
								2023/5/4
							</Typography>
						</Box>
						<Typography>
							ChatGPTを子供が使うデメリットを具体的に提示出来ないのに禁止しようとする。12歳という年齢を選んだ理由も無し。
							新技術を調べもせずに「わからないから不安。だから禁止」
							根拠無く子供に制限を加えようとする暴論を批判せずに受け入れる社会に未来は無いかなぁ、、と
						</Typography>
					</Box>
				</ListItem>
				<Divider variant="inset" component="li" />
				<ListItem alignItems="flex-start">
					<ListItemAvatar>
						<Avatar alt="Nemy Sharp" src="/static/images/avatar/1.jpg" />
					</ListItemAvatar>
					<Box sx={{ flexGrow: 1 }}>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<Typography
								sx={{ fontWeight: "bold" }}
								component="span"
								variant="body2"
								color="text.primary"
							>
								UserName
							</Typography>
							<Typography
								sx={{ ml: "10px" }}
								component="span"
								variant="body2"
								color="text.primary"
							>
								2023/5/4
							</Typography>
						</Box>
						<Typography>
							ChatGPTを子供が使うデメリットを具体的に提示出来ないのに禁止しようとする。12歳という年齢を選んだ理由も無し。
							新技術を調べもせずに「わからないから不安。だから禁止」
							根拠無く子供に制限を加えようとする暴論を批判せずに受け入れる社会に未来は無いかなぁ、、と
						</Typography>
					</Box>
				</ListItem>
			</List>
		</Box>
	);
};

export default TweetList;
