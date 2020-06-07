import router from '@system.router'
import clipboard from '@system.clipboard'
import prompt from '@system.prompt'
import ad from '@service.ad'
export default Custom_page({
  // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
  private: {
    newsList: [],
    footerAdShow: false,
    footerAd: {},
    searchValue: ''
  },
  onInit() {
    this.getData()
    this.insertAd()
    this.queryFooterAd()
  },
  async getData() {
    const $appDef = this.$app.$def
    const {data} = await $appDef.$http.get(`/hotlajifenlei/index?key=${$appDef.key}`)
    if(data.code === 200) {
      if(data.newslist.length > 10) {
        //json对象,key值是唯一的,key值可以为数字
        var json={};
        while(this.newsList.length < 10){
          var k = Math.round(Math.random()*data.newslist.length);
          if(!json[k]){
            json[k]=true;
            this.newsList.push(data.newslist[k]);
          }
        }
      } else {
        this.newsList = data.newslist
      }
    }
  },
  onShow() {
  },
  hideFooterAd() {
      this.footerAdShow = false
      this.nativeAd && this.nativeAd.destroy()
  },
  queryFooterAd() {
    if(!ad.createNativeAd) {
      return 
    }
    //   原生广告
    this.nativeAd = ad.createNativeAd({
        adUnitId: '710f447121654edd9b3fadc32e8e3e8e'
    })
    this.nativeAd.load()
    this.nativeAd.onLoad((res) => {
      this.footerAd = res.adList[0]
      this.footerAdShow = true
    })
  },
  reportAdClick() {
    this.nativeAd && this.nativeAd.reportAdClick({
        adId: this.footerAd.adId
    })
  },
  reportAdShow() {
    this.nativeAd && this.nativeAd.reportAdShow({
        adId: this.footerAd.adId
    })
  },
//   插屏广告
  insertAd() {
    if(ad.createInterstitialAd) {
      this.interstitialAd = ad.createInterstitialAd({
          adUnitId: 'c734f27e9733409a88ff2160229c5c25'
      })
      this.interstitialAd.onLoad(()=> {
          this.interstitialAd.show();
      })
    }
  },
  onHide() {
    this.interstitialAd && this.interstitialAd.destroy() 
  },
  newsItemClick(item) {
    if(!item) {
      return
    }
    this.searchValue = item.name
  },
  toSearch() {
    if(!this.searchValue) {
      return
    }
    router.push({
      uri: '/Search',
      params: {
        searchValue: this.searchValue
      }
    }) 
  },
  searchValueChange(e) {
    this.searchValue = e.value
  }
})