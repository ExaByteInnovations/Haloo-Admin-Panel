import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

export default function BasicCard({title, count}) {
  return (
    <Card sx={{minWidth: 275}}>
      <CardContent>
        <Typography sx={{fontSize: 14}} color='text.secondary' gutterBottom>
          {title}
        </Typography>
        <Typography variant='h5' component='div'>
          {count}
        </Typography>
      </CardContent>
    </Card>
  )
}
