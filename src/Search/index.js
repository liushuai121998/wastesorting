import ad from '@service.ad'
import prompt from '@system.prompt';
export default Custom_page({
    // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
    // private: {
    //   footerAdShow: false,
    //   footerAd: {}
    // },
    data: {
      footerAdShow: false,
      footerAd: {},
      searchValue: '',
      newsList: []
    },
    onInit() {
      this.getData()
      this.insertAd()
      this.queryFooterAd()
    },
    async getData() {
      const $appDef = this.$app.$def
      const {data} = await $appDef.$http.get(`/lajifenlei/index?key=${$appDef.key}&word=${this.searchValue}`)
      this.newsList = data.newslist
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
    }
})