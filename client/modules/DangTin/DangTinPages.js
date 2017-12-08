import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { getCategories, getCities, getDistricts, getWards, getId } from '../App/AppReducer';
import { fetchDistricts, fetchWards, addDistricts, addWards, setNotify } from '../App/AppActions';
import { postNews, uploadImage } from './DangTinActions';
import  CKEditor from 'react-ckeditor-component';
import styles from '../../main.css';
import 'react-image-crop/dist/ReactCrop.css';
import {Cropper} from 'react-image-cropper'
import numeral from 'numeral';

class DangTinPages extends Component {
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

      thumbnail: 0,
      thumbnailTemp: 0,
      isAction: false,

      isSubmitting: false,
    };
  }
  componentWillMount() {
    if (this.props.id === '') {
      this.context.router.push('/');
    }
  }
  isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };
  updateContent = (newContent) => {
    this.setState({
      content: newContent
    });
  };
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
  handlePrice = (eventKey) => {
    if (this.isNumeric(eventKey.target.value.trim().replace(/,/g, ''))) {
      this.setState({ price: eventKey.target.value.trim().replace(/,/g, '') });
    } else {
      this.setState({ price: '' });
    }
  };
  handleName = (eventKey) => { this.setState({ name: eventKey.target.value }); };
  handlePhone = (eventKey) => { this.setState({ phone: eventKey.target.value.trim()}); };
  handleAddressContact = (eventKey) => { this.setState({ addressContact: eventKey.target.value }); };
  handleCheck = () => { this.setState({ check: !this.state.check }); };
  submit = () => {
    if (this.state.check) {
      if (this.state.imagesBase64.length === 0) {
        this.props.dispatch(setNotify('Bạn phải upload ít nhất một hình'));
        return;
      }
      if (this.state.category.trim() === '') {
        this.props.dispatch(setNotify('Vui lòng chọn danh mục'));
        return;
      }
      if (this.state.price.trim() === '') {
        this.props.dispatch(setNotify('Vui lòng nhập giá'));
        return;
      }
      if (this.state.city.trim() === '') {
        this.props.dispatch(setNotify('Vui lòng chọn Tỉnh/Thành'));
        return;
      }
      if (this.state.district.trim() === '') {
        this.props.dispatch(setNotify('Vui lòng chọn Quận/Huyện'));
        return;
      }
      if (this.state.ward.trim() === '') {
        this.props.dispatch(setNotify('Vui lòng chọn Phường/Xã'));
        return;
      }
      if (this.state.address.trim() === '') {
        this.props.dispatch(setNotify('Vui lòng nhập địa chỉ'));
        return;
      }
      if (this.state.title.trim() === '') {
        this.props.dispatch(setNotify('Vui lòng nhập tiêu đề tin rao vặt'));
        return;
      }
      if (this.state.content.trim() === '') {
        this.props.dispatch(setNotify('Vui lòng nhập nội dung tin rao vặt'));
        return;
      }
      if (this.state.name.trim() === '') {
        this.props.dispatch(setNotify('Vui lòng nhập tên liên lạc'));
        return;
      }
      if (this.state.phone.trim() === '') {
        this.props.dispatch(setNotify('Vui lòng nhập số điện thoại liên lạc'));
        return;
      }
      if (this.state.addressContact.trim() === '') {
        this.props.dispatch(setNotify('Vui lòng nhập địa chỉ liên lạc'));
        return;
      }
      const news = {
        category: this.state.category,
        userId: this.props.id,
        city: this.state.city,
        district: this.state.district,
        ward: this.state.ward,
        type: 'news',
        address: this.state.address,
        keywords: [],
        title: this.state.title,
        price: this.state.price,
        content: this.state.content,
        check: this.state.check,
        imagesBase64: this.state.imagesBase64,
        thumbnail: this.state.thumbnail,
        contact: {
          name: this.state.name,
          phone: this.state.phone,
          address: this.state.addressContact,
        },
      };
      this.setState({ isSubmitting: true });
      this.props.dispatch(postNews(news)).then((res) => {
        console.log(res);
        this.setState({ isSubmitting: false });
        if (res.news === 'success') {
          this.context.router.push('/');
          this.props.dispatch(setNotify('Tin đang được chờ phê duyệt!'));
        } else {
          this.props.dispatch(setNotify('Tin đã bị cấm đăng'));
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
            <p className={styles.postNews}>ĐĂNG TIN</p>
            <div className="form-horizontal">

              <div className="form-group">
                <label className="col-sm-3 control-label" style={{ textAlign: 'left', fontSize: '11pt' }}>Chọn danh mục</label>
                <div className="col-sm-9">
                  <select className="input-large form-control" onChange={this.selectCategory}>
                    <option value="none" style={{ fontSize: '11pt' }}>Chọn danh mục</option>
                    {
                      this.props.categories.map((cate, index) => (
                        <option key={`${index}Cate`} value={cate._id} style={{ fontSize: '11pt' }}>{cate.title}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" style={{ textAlign: 'left', fontSize: '11pt' }}>Tỉnh thành</label>
                <div className="col-sm-9">
                  <select className="input-large form-control" onChange={this.selectCity}>
                    <option value="none" style={{ fontSize: '11pt' }}>Chọn tỉnh thành</option>
                    {
                      this.props.cities.map((city, index) => (
                        <option key={`${index}City`} value={city._id} style={{ fontSize: '11pt' }}>{city.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" style={{ textAlign: 'left', fontSize: '11pt' }}>Quận/Huyện</label>
                <div className="col-sm-9">
                  <select className="input-large form-control" onChange={this.selectDistrict}>
                    <option value="none">
                      {
                        (this.state.city === 'none') ?
                          'Vui lòng chọn tỉnh thành'
                          : this.props.districts.length > 0 ? 'Chọn Quận/Huyện' : 'Đang tải'
                      }
                    </option>
                    {
                      this.props.districts.map((district, index) => (
                        <option key={`${index}District`} value={district._id} style={{ fontSize: '11pt' }}>{district.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" style={{ textAlign: 'left', fontSize: '11pt' }}>Phường/Xã</label>
                <div className="col-sm-9">
                  <select className="input-large form-control" onChange={this.selectWard}>
                    <option value="none">
                      {
                        (this.state.district === 'none') ?
                          'Vui lòng chọn Quận/Huyện'
                          : this.props.wards.length > 0 ? 'Chọn Phường/Xã' : 'Đang tải'
                      }
                    </option>
                    {
                      this.props.wards.map((ward, index) => (
                        <option key={`${index}Ward`} value={ward._id} style={{ fontSize: '11pt' }}>{ward.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" style={{ textAlign: 'left', fontSize: '11pt' }}>Địa chỉ</label>
                <div className="col-sm-9">
                  <input className="form-control" style={{ fontSize: '11pt' }} type="text" value={this.state.address} onChange={this.handleAddress} />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" style={{ textAlign: 'left', fontSize: '11pt' }}>Tiêu đề</label>
                <div className="col-sm-9">
                  <input className="form-control" style={{ fontSize: '11pt' }} type="text" value={this.state.title} onChange={this.handleTitle} maxLength="200" />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" style={{ textAlign: 'left', fontSize: '11pt' }}>Giá (VNĐ)</label>
                <div className="col-sm-9">
                  <input className="form-control" style={{ fontSize: '11pt' }} type="text" value={this.state.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} onChange={this.handlePrice} />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" style={{ textAlign: 'left', fontSize: '11pt' }}>
                  Nội dung<br  /><p style={{ color: 'rgb(204, 204, 204)', fontSize: '10pt', fontStyle: 'italic', paddingTop: '16px' }}>(Tối đa 2000 kí tự)</p>
                </label>
                <div className="col-sm-9">
                  <CKEditor
                    activeClass={`p10 ${styles.customCKeditor}`}
                    content={this.state.content}
                    events={{ change: this.onChange, blur: () => {}, afterPaste: () => {} }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" style={{ textAlign: 'left', fontSize: '11pt' }}>Hình ảnh</label>
                <div className="col-sm-9">
                  <div style={{ overflow: 'auto' }}>
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
                          <div key={`${index}Newser`} className={styles.containerImages}>
                            <a onClick={() => this.onAction(index)}>
                              <img width={100} height={75} src={r}/>
                            </a>
                          </div>
                        )
                      }
                    })
                  }
                  {
                    (this.state.imagesBase64.length < 5) ? (
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
                  <div><p style={{ fontSize: '10pt', color: '#ccc', textAlign: 'left', paddingTop: '10px', fontStyle: 'italic' }}>(Số lượng hình tối đa 5 hình, kích thước hình uu tiên là 960x720px)</p></div>
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" style={{ textAlign: 'left', fontSize: '11pt' }}>Tên liên hệ</label>
                <div className="col-sm-9">
                  <input className="form-control"type="text" style={{ fontSize: '11pt' }} value={this.state.name} onChange={this.handleName} />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" style={{ textAlign: 'left', fontSize: '11pt' }}>Số điện thoại</label>
                <div className="col-sm-9">
                  <input className="form-control" type="text" style={{ fontSize: '11pt' }} value={this.state.phone} onChange={this.handlePhone} />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-3 control-label" style={{ textAlign: 'left', fontSize: '11pt' }}>Địa chỉ</label>
                <div className="col-sm-9">
                  <input className="form-control" style={{ fontSize: '11pt' }} type="text" value={this.state.addressContact} onChange={this.handleAddressContact} />
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
                  <button onClick={this.submit} className={styles.submitNews} disabled={this.state.isSubmitting} style={{ fontSize: '11pt', fontWeight: 'bold' }} >
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

          <Modal
            show={this.state.isAction}
            onHide={this.onHideAction}
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title>Thao tác</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Xóa ảnh hoặc chọn ảnh làm hình nền
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.onHideAction}>Thoát</Button>
              <Button onClick={this.deleteUploadImage}>Xóa</Button>
              <Button onClick={this.pickThumbnail}>Chọn làm hình nền</Button>
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
    categories: getCategories(state),
    cities: getCities(state),
    districts: getDistricts(state),
    wards: getWards(state),
    id: getId(state),
  };
}

DangTinPages.propTypes = {
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  cities: PropTypes.array.isRequired,
  districts: PropTypes.array.isRequired,
  wards: PropTypes.array.isRequired,
};

DangTinPages.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(DangTinPages);
