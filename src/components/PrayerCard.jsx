/* eslint-disable react/prop-types */
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function PrayerCard({ prayerName, prayerTime,prayerImage }) {
  return (
    <Card sx={{ width: "345px" }}>
      <CardMedia
        sx={{ height: 140 }}
        image={prayerImage}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {prayerName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {prayerTime}
        </Typography>
      </CardContent>
    </Card>
  );
}
