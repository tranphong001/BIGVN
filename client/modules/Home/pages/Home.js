import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Detail from '../Components/Detail';
import VIP from '../../SharedComponents/VIP';
import Adv from '../../SharedComponents/Adv';
import { fetchCategories, setVisibleBlog, setPageHeader } from '../../App/AppActions';
import {
  getId, getCategories, getBanners, getTopics, getVipAll, getSearchString, getSearchCity, getSearchCategory,
  getExpanded, getVisibleBlog, getIsTyping
} from '../../App/AppReducer';
import styles from '../../../main.css';
import grid from '../../../grid.css';
import List from '../Components/List';
import style from './Home.css';
import CircularProgress from 'material-ui/CircularProgress';
import { fetchTag, setRelated, fetchRelatedNews, fetchBlog, addNewsList, addBlogList, addNews, fetchNewsByCategoryVip, addNewsVipList, fetchNews, fetchBlogByAlias, fetchBlogByTopic } from '../HomeActions';
import { getCurrentPage } from '../HomeReducer';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'none',
      oldSearchCity: '',

      oldParams: {},
      oldRoute: {},
    };
  }
  componentDidMount() {
    const params = this.props.params;
    const route = this.props.route;
    if (params.hasOwnProperty('alias')) {
      if (this.props.route.path.indexOf('tag') !== -1) {
        this.fetchNews(params.alias.toLowerCase(), '');
        this.fetchTag(params.alias.toLowerCase(), '');
      } else {
        this.fetchNews(params.alias.toLowerCase(), '');
      }
    } else {
      if (route.hasOwnProperty('path') && route.path.indexOf('tag') !== -1) {
        this.setState({ oldRoute: route });
        this.fetchTag(params.alias, '');
      } else {
        this.fetchNews(params.alias, '');
        this.setState({ oldParams: params });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      (
        JSON.stringify(nextProps.params) !== JSON.stringify(this.state.oldParams) ||
        JSON.stringify(nextProps.route) !== JSON.stringify(this.state.oldRoute)
      ) &&
        this.props.categories.length > 0 &&
        this.props.topics.length > 0
    ) {
      if (nextProps.route.hasOwnProperty('path') && nextProps.route.path.indexOf('tag') !== -1) {
        this.setState({ oldRoute: nextProps.route });
        this.fetchTag(nextProps.params.alias, '');
      } else {
        this.fetchNews(nextProps.params.alias, '');
        this.setState({ oldParams: nextProps.params });
      }
    }
  }
  reset = () => {
    this.props.dispatch(addNews({}));
    this.props.dispatch(setRelated([]));
    this.props.dispatch(addNewsList([]));
    this.props.dispatch(addNewsVipList([]));
  };
  fetchNews = (alias, url) => {
    this.reset();
    this.props.dispatch(fetchNews(alias, url)).then((res) => {
      this.setState({ mode: res.mode });
    });
  };
  fetchTag = (alias, url) => {
    this.reset();
    this.props.dispatch(fetchTag(alias, url)).then((res) => {
      this.setState({ mode: res.mode });
    });
  };
  render() {
    return (
      <div className="container">
        {
          (this.state.mode === 'list') ? (
            <div className={`${grid.contentWidth} col-xs-12`}>
              <List alias={this.state.alias} />
            </div>
          ) : ''
        }
        {
          (this.state.mode === 'detail') ? (
            <div className={`${grid.contentWidthDetail} col-xs-12`}>
              <Detail alias={this.state.alias} />
            </div>
          ) : ''
        }

        <div className={`${styles.vipWidth} col-xs-12 ${styles.vipSection}`}>
          <div style={{ padding: '12px 0 25px 10px' }}>
            <i className={`fa fa-star ${styles.vipStar}`} aria-hidden="true" />
            <span className={styles.vipTitle}>TIN VIP</span>
          </div>
          <div style={{ display: 'flex', flexFlow: 'wrap', justifyContent: 'space-between' }}>
            {
              this.props.vipAll.map((vip, index) => (
                <VIP info={vip} key={`${index}Vip`} index={index} />
              ))
            }
          </div>
        </div>
        <Adv banners={this.props.banners} />
      </div>
    );
  }
}

Home.need = [() => { return fetchCategories(); }];
// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    id: getId(state),
    categories: getCategories(state),
    topics: getTopics(state),
    banners: getBanners(state),
    vipAll: getVipAll(state),
    expanded: getExpanded(state),
    searchCategory: getSearchCategory(state),
    searchString: getSearchString(state),
    searchCity: getSearchCity(state),
    currentPage: getCurrentPage(state),
    visibleBlog: getVisibleBlog(state),
    isTyping: getIsTyping(state),
  };
}

Home.propTypes = {
  route: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  topics: PropTypes.array.isRequired,
  banners: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  vipAll: PropTypes.array.isRequired,
  params: PropTypes.object,
  searchCategory: PropTypes.string.isRequired,
  searchString: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  visibleBlog: PropTypes.bool.isRequired,
  isTyping: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
};

Home.contextTypes = {
  router: PropTypes.object,
};

export default connect(mapStateToProps)(Home);
