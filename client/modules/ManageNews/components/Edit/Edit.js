import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormControl, Button, Modal } from 'react-bootstrap';
import ImageGallery from 'react-image-gallery';
import style from '../../../../../node_modules/react-image-gallery/styles/css/image-gallery.css';
import numeral from 'numeral';
import { getCategories, getCities, getDistricts, getWards, getId } from '../../../App/AppReducer';
import { fetchDistricts, fetchWards, addDistricts, addWards, setNotify } from '../../../App/AppActions';
import { postNews, uploadImage } from '../../../DangTin/DangTinActions';
import { edit } from '../../ManageNewsActions';
import  CKEditor from 'react-ckeditor-component';
import styles from '../../../../main.css';
import 'react-image-crop/dist/ReactCrop.css';
import {Cropper} from 'react-image-cropper';

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: '',
      city: 'none',
      district: 'none',
      ward: 'none',

      address: '',
      title: '',
      price: '',
      content: '',

      name: '',
      phone: '',
      addressContact: '',
      check: false,

      images: [],
      imagesBase64: [],
      isCrop: false,
      cropSrc: '',

      base64image: [],
      deleteImage: '',
      deleteImages: [],
      isConfirm: false,
      thumbnail: 0,
      thumbnailTemp: 0,
      isAction: false,

      isSubmitting: false
    };
  }
  componentDidMount() {
    const info = this.props.info;
    this.props.categories.map((cate) => {
      if (cate._id === info.category) { this.setState({ category: cate._id }); }
    });
    this.props.cities.map((city) => {
      if (city._id === info.city) {
        this.setState({ city: city._id });
        this.props.dispatch(fetchDistricts(city._id)).then(() => {
          this.props.districts.map((district) => {
            if (district._id === info.district) {
              this.setState({ district: info.district});
              this.props.dispatch(fetchWards(district._id)).then(() => {
                this.props.wards.map((ward) => {
                  if (ward._id === info.ward) { this.setState({ ward: ward._id }); }
                })
              });
            }
          });
        });
      }
    });
    this.setState({
      content: info.content,
      title: info.title,
      address: info.address,
      price: info.price,
      thumbnail: info.thumbnail,
      thumbnailTemp: info.thumbnail,
      name: info.contact.name,
      phone: info.contact.phone,
      addressContact: info.contact.address,
      imagesBase64: info.imageDirectories,
    })
  }

  onChange = (evt) => {
    const newContent = evt.editor.getData();
    this.setState({
      content: newContent
    });
  };
  selectCategory = (event) => {
    this.setState({ category: event.target.value });
  };
  selectCity = (event) => {
    this.setState({ city: event.target.value });
    if (event.target.value !== 'none') {
      this.props.dispatch(fetchDistricts(event.target.value));
    } else {
      this.setState({ district: 'none', ward: 'none' });
      this.props.dispatch(addDistricts([]));
      this.props.dispatch(addWards([]));
    }
  };
  selectDistrict = (event) => {
    this.setState({ district: event.target.value });
    if (event.target.value !== 'none') {
      this.props.dispatch(fetchWards(event.target.value));
    } else {
      this.setState({ ward: 'none' });
      this.props.dispatch(addWards([]));
    }
  };
  selectWard = (event) => {
    this.setState({ ward: event.target.value });
  };
  handleAddress = (eventKey) => { this.setState({ address: eventKey.target.value }); };
  handleTitle = (eventKey) => { this.setState({ title: eventKey.target.value }); };
  handlePrice = (eventKey) => { this.setState({ price: eventKey.target.value.trim()}); };
  handleName = (eventKey) => { this.setState({ name: eventKey.target.value }); };
  handlePhone = (eventKey) => { this.setState({ phone: eventKey.target.value.trim()}); };
  handleAddressContact = (eventKey) => { this.setState({ addressContact: eventKey.target.value }); };
  handleCheck = () => { this.setState({ check: !this.state.check }); };
  submit = () => {
    const news = {
      id: this.props.info._id,
      type: 'news',
      category: this.state.category,
      userId: this.props.id,
      city: this.state.city,
      district: this.state.district,
      ward: this.state.ward,
      address: this.state.address,
      title: this.state.title,
      price: this.state.price,
      content: this.state.content,
      deleteImages: this.state.deleteImages,
      imagesBase64: this.state.base64image,
      thumbnail: this.state.thumbnail,
      contact: {
        name: this.state.name,
        phone: this.state.phone,
        address: this.state.addressContact,
      },
    };
    console.log(news);
    this.setState({ isSubmitting: true });
    this.props.dispatch(edit(news)).then((res) => {
      this.setState({ isSubmitting: false });
      console.log(res);
      if (res.news === 'success') {
        this.context.router.push('/');
        this.props.dispatch(setNotify('Tin chỉnh sửa đang được chờ phê duyệt!'));
      } else {
        this.props.dispatch(setNotify('Tin đã bị cấm chỉnh sửa'));
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
                <select value={this.state.category} className="input-large form-control" onChange={this.selectCategory}>
                  <option value="none">Chọn danh mục</option>
                  {
                    this.props.categories.map((cate, index) => (
                      <option key={`${index}Cate`} value={cate._id}>{cate.title}</option>
                    ))
                  }
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '13pt' }}>Tỉnh thành</label>
              <div className="col-sm-9">
                <select value={this.state.city} className="input-large form-control" onChange={this.selectCity}>
                  <option value="none">Chọn tỉnh thành</option>
                  {
                    this.props.cities.map((city, index) => (
                      <option key={`${index}City`} value={city._id}>{city.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '13pt' }}>Quận/Huyện</label>
              <div className="col-sm-9">
                <select value={this.state.district} className="input-large form-control" onChange={this.selectDistrict}>
                  <option value="none">
                    {
                      (this.state.city === 'none') ?
                        'Vui lòng chọn tỉnh thành'
                        : this.props.districts.length > 0 ? 'Chọn Quận/Huyện' : 'Đang tải'
                    }
                  </option>
                  {
                    this.props.districts.map((district, index) => (
                      <option key={`${index}District`} value={district._id}>{district.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '13pt' }}>Phường/Xã</label>
              <div className="col-sm-9">
                <select value={this.state.ward} className="input-large form-control" onChange={this.selectWard}>
                  <option value="none">
                    {
                      (this.state.district === 'none') ?
                        'Vui lòng chọn Quận/Huyện'
                        : this.props.wards.length > 0 ? 'Chọn Phường/Xã' : 'Đang tải'
                    }
                  </option>
                  {
                    this.props.wards.map((ward, index) => (
                      <option key={`${index}Ward`} value={ward._id}>{ward.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '13pt' }}>Địa chỉ</label>
              <div className="col-sm-9">
                <input className="form-control" type="text" value={this.state.address} onChange={this.handleAddress} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '13pt' }}>Tiêu đề</label>
              <div className="col-sm-9">
                <input className="form-control" type="text" value={this.state.title} onChange={this.handleTitle} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '13pt' }}>Giá(VND)</label>
              <div className="col-sm-9">
                <input className="form-control" type="text" value={this.state.price} onChange={this.handlePrice} />
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
              <label className="col-sm-3 control-label" style={{ textAlign: 'left' }}>Tên liên hệ</label>
              <div className="col-sm-9">
                <input className="form-control"type="text" value={this.state.name} onChange={this.handleName} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '13pt' }}>Số điện thoại</label>
              <div className="col-sm-9">
                <input className="form-control" type="text" value={this.state.phone} onChange={this.handlePhone} />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-3 control-label text-left" style={{ textAlign: 'left', fontSize: '13pt' }}>Địa chỉ</label>
              <div className="col-sm-9">
                <input className="form-control" type="text" value={this.state.addressContact} onChange={this.handleAddressContact} />
              </div>
            </div>

            <div className="form-group">
              <div className="col-md-3"></div>
              <div className="col-sm-9">
                <button onClick={this.submit} className={styles.submitPost} disabled={this.state.isSubmitting} >
                  {this.state.isSubmitting ? 'Đang gửi' : 'Gửi tin chờ duyệt'}
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
    categories: getCategories(state),
    cities: getCities(state),
    districts: getDistricts(state),
    wards: getWards(state),
  };
}

Edit.propTypes = {
  info: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  cities: PropTypes.array.isRequired,
  districts: PropTypes.array.isRequired,
  wards: PropTypes.array.isRequired,
};

Edit.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Edit);
