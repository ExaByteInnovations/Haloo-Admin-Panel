import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

export default function BasicCard({title, count, color}) {
  return (
    <Card sx={{minWidth: 275, minHeight: 130, position: 'relative', backgroundColor: color}}>
      <CardContent>
        <Typography sx={{fontSize: 14, fontWeight: 'bold'}} color='text.secondary' gutterBottom>
          {title}
        </Typography>
        <Typography
          variant='h5'
          component='div'
          sx={{fontSize: 60, position: 'absolute', bottom: 10, right: 10}}
        >
          {count}
        </Typography>
      </CardContent>
    </Card>
  )
}
