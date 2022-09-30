import Editor from 'ckeditor5-custom-build/build/ckeditor'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import {useLocation, useHistory} from 'react-router-dom'
import {useState} from 'react'
import '../App.css'
import {PageTitle} from '../../_metronic/layout/core'
import {Button} from 'react-bootstrap-v5'
import {ApiPut} from '../../helpers/API/ApiData'
import {toast} from 'react-toastify'
import {Modal} from 'react-bootstrap'

const TextEditor = () => {
  const history = useHistory()
  const {
    state: {id, pageData, pageName},
  } = useLocation()
  const [data, setData] = useState(pageData)
  const [show, setShow] = useState(false)
  const [isDataChanged, setIsDataChanged] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setShow(false)
  }

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

  // if (loading) {
  //   return (
  //     <Box className='loader'>
  //       <CircularProgress />
  //     </Box>
  //   )
  // }

  const click = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const TextEditorBreadCrumbs = [
    {
      title: 'Settings',
      path: '/settings/edit-profile',
      isSeparator: false,
      isActive: false,
    },
    {
      title: 'Static Pages',
      path: '/settings/static-pages',
      isSeparator: false,
      isActive: false,
    },
    {
      title: '',
      path: '',
      isSeparator: true,
      isActive: false,
    },
  ]

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <>
          <Modal.Header closeButton>
            <Modal.Title className='text-danger'>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to Go Back beacuse your changes will be lost
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button variant='danger' onClick={() => history.push('/settings/static-pages')}>
              Confirm
            </Button>
          </Modal.Footer>
        </>
      </Modal>
      <PageTitle breadcrumbs={TextEditorBreadCrumbs}>
        {pageName?.charAt(0)?.toUpperCase() + pageName?.slice(1)}
      </PageTitle>
      <CKEditor
        id={id}
        editor={Editor}
        data={data}
        onChange={(page, editor) => {
          setData(editor.getData())
          setIsDataChanged(true)
        }}
      />
      <div className='d-flex justify-content-center py-6 px-9'>
        <button
          className='btn btn-white btn-active-light-primary me-2'
          onClick={() =>
            isDataChanged && pageData !== data
              ? setShow(true)
              : history.push('/settings/static-pages')
          }
        >
          Discard
        </button>
        <button
          className='btn btn-primary'
          onClick={() => {
            handleUpdate()
            setIsDataChanged(false)
            click()
          }}
        >
          {!loading && 'Save'}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...{' '}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
    </>
  )
}

export {TextEditor}
