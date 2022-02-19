import {CKEditor} from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {useLocation, useHistory} from 'react-router-dom'
import {useState} from 'react'
import '../App.css'
import {PageTitle} from '../../_metronic/layout/core'
import {Box, CircularProgress} from '@material-ui/core'
import {Button} from 'react-bootstrap-v5'
import {ApiPut} from '../../helpers/API/ApiData'
import {toast} from 'react-toastify'

const Editor = () => {
  const history = useHistory()
  const {
    state: {id, pageData, pageName},
  } = useLocation()
  const [data, setData] = useState(pageData)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    try {
      setLoading(true)
      const response = await ApiPut(`staticfile?_id=${id}`, {action: data})

      if (response.status === 200) {
        toast.success('Updated Successfully')
      }
      setLoading(false)
    } catch (err) {
      toast.error(err.message)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box className='loader'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {pageName?.charAt(0)?.toUpperCase() + pageName?.slice(1)}
      </PageTitle>
      <CKEditor
        id={id}
        editor={ClassicEditor}
        // config={{Plugin: [GeneralHtmlSupport]}}
        data={data}
        onChange={(page, editor) => setData(editor.getData())}
      />
      <Box sx={{marginTop: '10px'}}>
        <Button style={{marginRight: '10px'}} size='lg' variant='success' onClick={handleUpdate}>
          Save
        </Button>
        <Button size='lg' variant='danger' onClick={() => history.push('/settings/static-pages')}>
          Go Back
        </Button>
      </Box>
    </>
  )
}

export {Editor}
