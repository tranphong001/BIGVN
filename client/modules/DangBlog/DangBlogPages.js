import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { getCategories, getCities, getDistricts, getWards, getId } from '../App/AppReducer';
import { fetchDistricts, fetchWards, addDistricts, addWards, setNotify } from '../App/AppActions';
import { postNews } from '../DangTin/DangTinActions';
import { postBlog, uploadImage, fetchTopics } from './DangBlogActions';
import { getTopics } from './DangBlogReducer';
import  CKEditor from 'react-ckeditor-component';
import styles from '../../main.css';
import 'react-image-crop/dist/ReactCrop.css';
import {Cropper} from 'react-image-cropper'

class DangBlogPages extends Component {
  constructor(props) {
    super(props);
    //this.updateContent = this.updateContent.bind(this);
    this.state = {
      topic: '',

      title: '',
      content: '',
      summary: '',

      check: false,

      imagesBase64: [],
      isCrop: false,
      cropSrc: '',

      thumbnail: 0,
      thumbnailTemp: 0,
      isAction: false,

      isSubmitting: false,
    };
  }
  componentWillMount() {
    if (this.props.id === '') {
      this.context.router.push('/');
    } else {
      this.props.dispatch(fetchTopics());
    }
  }
  updateContent = (newContent) => {
    this.setState({
      content: newContent
    });
  };
  onChange2 = (evt) => {
    // const newContent = evt.editor.getData();
    this.setState({
      summary: evt.target.value
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
  handleCheck = () => { this.setState({ check: !this.state.check }); };
  submit = () => {
    if (this.state.check) {
      const blog = {
        userId: this.props.id,
        topic: this.state.topic,
        type: 'blog',
        title: this.state.title,
        summary: this.state.summary,
        content: this.state.content,
        imagesBase64: this.state.imagesBase64,
        thumbnail: this.state.thumbnail,
      };
      console.log(blog);
      this.setState({ isSubmitting: true });
      this.props.dispatch(postNews(blog)).then((res) => {
        this.setState({ isSubmitting: false });
        console.log(res);
        if (res.news === 'success') {
          this.context.router.push('/');
          this.props.dispatch(setNotify('Blog đang được chờ phê duyệt!'));
        } else {
          this.props.dispatch(setNotify('Blog đã bị cấm đăng'));
        }
      });
    } else {
      this.props.dispatch(setNotify('Bạn chưa cam đoán thông tin của tin rao!'));
    }
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
    this.setState({ imagesBase64: [...this.state.imagesBase64, this.refs.cropper.crop()], isCrop: false });
  };

  onAction = (index) => { this.setState({ isAction: true, thumbnailTemp: index }); };
  onHideAction = () => { this.setState({ isAction: false }); };

  pickThumbnail = () => {
    this.setState({ thumbnail: this.state.thumbnailTemp, isAction: false });
  };
  deleteUploadImage = () => {
    if (this.state.thumbnailTemp >= this.state.thumbnail) {
      this.setState({
        imagesBase64: this.state.imagesBase64.filter((image, index) => index != this.state.thumbnailTemp),
        isAction: false,
        thumbnail: 0
      });
    } else {
      this.setState({
        imagesBase64: this.state.imagesBase64.filter((image, index) => index != this.state.thumbnailTemp),
        isAction: false
      });
    }
  };
  render() {
    return (
      <div>
        <div className="panel panel-default col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2">
          <div className="col-md-10 col-md-offset-1">
            <div className={styles.registerTitle}>
            <p className={styles.postNews}>ĐĂNG BLOG</p>
            <div className="form-horizontal">

              <div className="form-group">
                <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '11pt' }}>Chọn chuyên mục</label>
                <div className="col-sm-9">
                  <select className="input-large form-control" onChange={this.selectTopic}>
                    <option value="none">Chọn danh mục</option>
                    {
                      this.props.topics.map((topic, index) => (
                        <option key={`${index}Topic`} value={topic._id}>{topic.title}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '11pt' }}>Tiêu đề</label>
                <div className="col-sm-9">
                  <input className="form-control" type="text" value={this.state.title} onChange={this.handleTitle} maxLength="40" />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '11pt' }}>Tóm tắt</label>
                <div className="col-sm-9">
                  <textarea rows="4" className="form-control" type="text" value={this.state.summary} onChange={this.onChange2} />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '11pt' }}>Nội dung</label>
                <div className="col-sm-9">
                  <CKEditor
                    activeClass="p10"
                    content={this.state.content}
                    events={{ change: this.onChange, blur: () => {}, afterPaste: () => {} }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '11pt' }}>Hình ảnh</label>
                <div className="col-sm-9">
                  {
                    this.state.imagesBase64.map((r, index) => {
                      if (this.state.thumbnail === index) {
                        return (
                          <div key={`${index}Newser`} className={styles.containerImages}>
                            <a onClick={() => this.onAction(index)}>
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
                            </a>
                          </div>
                        )
                      } else {
                        return (
                          <div key={`${index}Blogger`} className={styles.containerImages}>
                            <a onClick={() => this.onAction(index)}>
                              <img width={100} height={75} src={r}/>
                            </a>
                          </div>
                        )
                      }
                    })
                  }
                  {
                    (this.state.imagesBase64.length < 1) ? (
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
                <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '11pt' }}>Từ khóa</label>
                <div className="col-sm-9">
                  <input className="form-control" type="text"  />
                </div>
              </div>

              <div className="form-group">
                <div className="col-md-3"></div>
                <div className="col-sm-9" style={{ textAlign: 'left', fontSize: '11pt' }}>
                  <label>
                    <input type="checkbox" checked={this.state.check} onChange={this.handleCheck} className={styles.marginRight10} />
                    <span style={{ paddingLeft: '5px', fontSize: '10pt' }}>Cam đoan tính xác thực của tin rao này</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <div className="col-md-3"></div>
                <div className="col-sm-9">
                  <button onClick={this.submit} className={styles.submitPost} disabled={this.state.isSubmitting} >
                    {this.state.isSubmitting ? 'ĐANG GỬI' : 'ĐĂNG TIN'}
                  </button>
                </div>
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
                ref="cropper"
                ratio={4/3}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.saveCrop}>Chọn</Button>
              <Button onClick={this.hideCrop}>Thoát</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    topics: getTopics(state),
    id: getId(state),
  };
}

DangBlogPages.propTypes = {
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  topics: PropTypes.array.isRequired,
};

DangBlogPages.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(DangBlogPages);
