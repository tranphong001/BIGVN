import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormControl, Button, Modal } from 'react-bootstrap';
import ImageGallery from 'react-image-gallery';
import style from '../../../../../node_modules/react-image-gallery/styles/css/image-gallery.css';
import numeral from 'numeral';
import { getTopics, getId } from '../../../App/AppReducer';
import { fetchDistricts, fetchWards, addDistricts, addWards, setNotify } from '../../../App/AppActions';
import { edit } from '../../ManageBlogActions';
import  CKEditor from 'react-ckeditor-component';
import styles from '../../../../main.css';
import 'react-image-crop/dist/ReactCrop.css';
import {Cropper} from 'react-image-cropper'

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',

      title: '',
      content: '',
      summary: '',

      images: [],
      imagesBase64: [],
      deleteImages: [],
      base64image: [],
      isCrop: false,
      isSubmitting: false,
      cropSrc: '',
    };
  }
  componentDidMount() {
    const info = this.props.info;
    this.props.topics.map((topic) => {
      if (topic._id === info.topic) { this.setState({ topic: topic._id }); }
    });
    this.props.topics.map((topic) => {
      if (topic._id === info.topic) {
        this.setState({ topic: topic._id });
      }
    });
    this.setState({
      content: info.content,
      summary: info.summary,
      thumbnail: info.thumbnail,
      title: info.title,
      imagesBase64: info.imageDirectories,
    })
  }
  updateContent = (newContent) => {
    this.setState({
      content: newContent
    });
  };

  onChange2 = (evt) => {
    const newContent = evt.editor.getData();
    this.setState({
      summary: newContent
    });
  };
  onChange = (evt) => {
    const newContent = evt.editor.getData();
    this.setState({
      content: newContent
    });
  };
  selectTopic = (event) => {
    this.setState({ topic: event.target.value });
  };
  handleTitle = (eventKey) => { this.setState({ title: eventKey.target.value }); };
  submit = () => {
    const blog = {
      id: this.props.info._id,
      v: this.state.topic,
      userId: this.props.id,
      type: 'blog',
      topic: this.state.topic,
      title: this.state.title,
      summary: this.state.summary,
      content: this.state.content,
      thumbnail: this.state.thumbnail,
      deleteImages: this.state.deleteImages,
      imagesBase64: this.state.base64image,
    };
    this.setState({ isSubmitting: true });
    this.props.dispatch(edit(blog)).then((res) => {
      this.setState({ isSubmitting: false });
      if (res.news === 'success') {
        this.context.router.push('/');
        this.props.dispatch(setNotify('Bài viết chỉnh sửa đang được chờ phê duyệt!'));
      } else {
        this.props.dispatch(setNotify('Bài viết đã bị cấm chỉnh sửa'));
      }
    });
  };
  onCrop = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];
    let base64image = null;
    reader.onload = (readerEvt) => {
      base64image = readerEvt.target.result;
    };
    reader.onloadend = () => {
      this.setState({
        cropSrc: base64image,
        isCrop: true
      });
    };
    reader.readAsDataURL(file);
  };
  hideCrop = () => { this.setState({ isCrop: false }); };
  saveCrop = () => {
    this.setState({ base64image: [...this.state.base64image, this.refs.cropperEdit.crop()], isCrop: false });
  };
  deleteImage = (image, index) => {
    this.setState({ isConfirm: true, deleteImage: image, thumbnailTemp: index });
  };
  hideConfirm = () => { this.setState({ isConfirm: false }); };
  addDeleteImage = () => {
    if (this.state.deleteImage !== '') {
      this.setState({
        deleteImages: [...this.state.deleteImages, this.state.deleteImage],
        imagesBase64: this.state.imagesBase64.filter(image => image != this.state.deleteImage),
        deleteImage: '',
        isConfirm: false,
        thumbnail: 0,
        thumbnailTemp: 0,
      });
    }
  };
  pickThumbnail = () => {
    this.setState({ thumbnail: this.state.thumbnailTemp, isConfirm: false });
  };
  render() {
    return (
      <div className="panel panel-default">
        <div className={styles.registerTitle}>
          <p className={styles.postNews}>ĐĂNG TIN</p>
          <div className="form-horizontal">

            <div className="form-group">
              <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '13pt' }}>Chọn danh mục</label>
              <div className="col-sm-9">
                <select value={this.state.topic} className="input-large form-control" onChange={this.selectTopic}>
                  <option value="none">Chọn chuyên mục</option>
                  {
                    this.props.topics.map((topic, index) => (
                      <option key={`${index}Topic`} value={topic._id}>{topic.title}</option>
                    ))
                  }
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '13pt' }}>Tiêu đề</label>
              <div className="col-sm-9">
                <input className="form-control" type="text" value={this.state.title} onChange={this.handleTitle} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label text-left">Tóm tắt</label>
              <div className="col-sm-9">
                <textarea rows="4" className="form-control" type="text" value={this.state.summary} onChange={this.onChange2} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '13pt' }}>Nội dung</label>
              <div className="col-sm-9">
                <CKEditor
                  activeClass="p10"
                  content={this.state.content}
                  events={{ change: this.onChange, blur: () => {}, afterPaste: () => {}  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '13pt' }}>Hình ảnh</label>
              <div className="col-sm-9">
                {
                  this.state.imagesBase64.map((r, index) => {
                    if (this.state.deleteImages.indexOf(r) === -1) {
                      if (this.state.thumbnail === index) {
                        return (
                          <a key={`${index}Newser`} onClick={() => this.deleteImage(r, index)}>
                            <div className={styles.containerImages}>
                              <div style={{ position: 'relative' }}>
                                <img width={100} height={75} src={`/photo/${r}`}/>
                                <div style={{
                                  position: 'absolute',
                                  width: '100%',
                                  height: '100%',
                                  top: '0',
                                  left: '0',
                                  border: '3px solid rgb(243, 146, 31)',
                                  borderRadius: '3px'
                                }}>
                                  <div style={{ display: 'table', verticalAlign: 'middle', textAlign: 'center',width: '100%', height: '100%' }}>
                                  <span style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                    Hình nền
                                  </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        )
                      } else {
                        return (
                          <a key={`${index}Newser`} onClick={() => this.deleteImage(r, index)}>
                            <div className={styles.containerImages}>
                              <img width={100} height={75} src={`/photo/${r}`}/>
                            </div>
                          </a>
                        )
                      }
                    }
                  })
                }
                {
                  this.state.base64image.map((r, index) => {
                    if (this.state.thumbnail === index + this.state.imagesBase64.length) {
                      return (
                        <a key={`${index}Newser`} onClick={() => this.deleteImage(r, index + this.state.imagesBase64.length)}>
                          <div className={styles.containerImages}>
                            <div style={{ position: 'relative' }}>
                              <img width={100} height={75} src={r}/>
                              <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: '0',
                                left: '0',
                                border: '3px solid rgb(243, 146, 31)',
                                borderRadius: '3px'
                              }}>
                                <div style={{ display: 'table', verticalAlign: 'middle', textAlign: 'center',width: '100%', height: '100%' }}>
                                  <span style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                                    Hình nền
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      )
                    } else {
                      return (
                        <a key={`${index}Newser`} onClick={() => this.deleteImage(r, index + this.state.imagesBase64.length)}>
                          <div className={styles.containerImages}>
                            <img width={100} height={75} src={r}/>
                          </div>
                        </a>
                      )
                    }
                  })
                }
                {
                  (this.state.imagesBase64.length + this.state.base64image < 5) ? (
                      <div className={styles.containerImages}>
                        <label htmlFor="file-upload" className={styles.customUpload}>
                          <i className="fa fa-cloud-upload" style={{ color: '#03a9f4' }} />
                          Tải hình ảnh
                        </label>
                        <input id="file-upload" accept="image/jpeg, image/png" type="file" style={{ display: 'none' }} onChange={this.onCrop} />
                      </div>
                    ) : ''
                }
              </div>
            </div>


            <div className="form-group">
              <div className="col-md-3"></div>
              <div className="col-sm-9">
                <button onClick={this.submit} className={styles.submitPost} disabled={this.state.isSubmitting} >
                  {this.state.isSubmitting ? 'Đang gửi' : 'Gửi bài viết chỉnh sửa'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Modal
          show={this.state.isCrop}
          onHide={this.hideCrop}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Cắt hình</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Cropper
              src={this.state.cropSrc}
              ref="cropperEdit"
              ratio={4/3}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.saveCrop}>Chọn</Button>
            <Button onClick={this.hideCrop}>Thoát</Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.isConfirm}
          onHide={this.hideConfirm}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Xóa hoặc chọn làm hình nền</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.addDeleteImage}>Xóa</Button>
            <Button onClick={this.pickThumbnail}>Chọn làm hình nền</Button>
            <Button onClick={this.hideConfirm}>Thoát</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    id: getId(state),
    topics: getTopics(state),
  };
}

Edit.propTypes = {
  info: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  topics: PropTypes.array.isRequired,
};

Edit.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Edit);
