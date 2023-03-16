System.register("chunks:///_virtual/BackgroundManager.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(o){"use strict";var t,n,r,e,i;return{setters:[function(o){t=o.inheritsLoose,n=o.createForOfIteratorHelperLoose},function(o){r=o.cclegacy,e=o._decorator,i=o.Component}],execute:function(){var s;r._RF.push({},"5f104kFguhHWrjhTlILwd68","BackgroundManager",void 0);var a=e.ccclass;e.property,o("BackgroundManager",a("BackgroundManager")(s=function(o){function r(){return o.apply(this,arguments)||this}t(r,o);var e=r.prototype;return e.start=function(){},e.update=function(o){for(var t,r=n(this.node.children);!(t=r()).done;){var e=t.value;e.setPosition(e.position.x,e.position.y-60*o,e.position.z),e.position.y<-1280&&e.setPosition(e.position.x,e.position.y+2560,e.position.z)}},r}(i))||s);r._RF.pop()}}}));

System.register("chunks:///_virtual/Bullet.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(t){"use strict";var e,i,o,n,r,s,a,c,l;return{setters:[function(t){e=t.applyDecoratedDescriptor,i=t.inheritsLoose,o=t.initializerDefineProperty,n=t.assertThisInitialized},function(t){r=t.cclegacy,s=t._decorator,a=t.Collider2D,c=t.Contact2DType,l=t.Component}],execute:function(){var u,p,d;r._RF.push({},"070637HHKdCc7lA8oQSdU6G","Bullet",void 0);var h=s.ccclass,y=s.property;t("Bullet",h("Bullet")((d=e((p=function(t){function e(){for(var e,i=arguments.length,r=new Array(i),s=0;s<i;s++)r[s]=arguments[s];return e=t.call.apply(t,[this].concat(r))||this,o(e,"speed",d,n(e)),e._isDead=!1,e}i(e,t);var r=e.prototype;return r.start=function(){var t=this.getComponent(a);t&&t.on(c.BEGIN_CONTACT,this.onBeginContact,this)},r.update=function(t){(this.node.position.y<-740||this.node.position.y>740)&&this.node.destroy(),(this.node.position.x<-460||this.node.position.x>460)&&this.node.destroy(),this._isDead&&this.node.destroy()},r.onBeginContact=function(t,e){2!=e.tag&&3!=e.tag||(this._isDead=!0)},e}(l)).prototype,"speed",[y],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 700}}),u=p))||u);r._RF.pop()}}}));

System.register("chunks:///_virtual/BulletManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameManager.ts"],(function(e){"use strict";var t,n,a,r,i,o,l,c,s,u,p,f,v;return{setters:[function(e){t=e.applyDecoratedDescriptor,n=e.inheritsLoose,a=e.initializerDefineProperty,r=e.assertThisInitialized},function(e){i=e.cclegacy,o=e._decorator,l=e.Prefab,c=e.director,s=e.instantiate,u=e.Vec3,p=e.Component},function(e){f=e.CURR_GAME_STATE,v=e.GameState}],execute:function(){var _,g,b,h,y;i._RF.push({},"b3a38SnNJpJeIWwIrnwue5p","BulletManager",void 0);var d=o.ccclass,m=o.property;e("BulletManager",(_=d("BulletManager"),g=m({type:l}),_((y=t((h=function(e){function t(){for(var t,n=arguments.length,i=new Array(n),o=0;o<n;o++)i[o]=arguments[o];return t=e.call.apply(e,[this].concat(i))||this,a(t,"bullet_prefab",y,r(t)),t._main_canvas=void 0,t}n(t,e);var i=t.prototype;return i.start=function(){var e=this;this._main_canvas=c.getScene().getChildByName("Canvas"),this.schedule((function(){if(f==v.running){var t=s(e.bullet_prefab);t.setParent(e._main_canvas);var n=new u(e.node.position.clone());n.y+=40,t.setPosition(n)}}),.2)},i.update=function(e){},t}(p)).prototype,"bullet_prefab",[g],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),b=h))||b));i._RF.pop()}}}));

System.register("chunks:///_virtual/Enemy.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(e){"use strict";var t,n,i,o,r,a,c,s,u;return{setters:[function(e){t=e.applyDecoratedDescriptor,n=e.inheritsLoose,i=e.initializerDefineProperty,o=e.assertThisInitialized},function(e){r=e.cclegacy,a=e._decorator,c=e.Collider2D,s=e.Contact2DType,u=e.Component}],execute:function(){var p,l,d;r._RF.push({},"d62b9KGdjJMNZU/j2xpdQg/","Enemy",void 0);var y=a.ccclass,f=a.property;e("Enemy",y("Enemy")((d=t((l=function(e){function t(){for(var t,n=arguments.length,r=new Array(n),a=0;a<n;a++)r[a]=arguments[a];return t=e.call.apply(e,[this].concat(r))||this,i(t,"speed",d,o(t)),t.isDead=!1,t}n(t,e);var r=t.prototype;return r.start=function(){var e=this.getComponent(c);e&&e.on(s.BEGIN_CONTACT,this.onBeginContact,this)},r.update=function(e){},r.onBeginContact=function(e,t){3==t.tag&&(this.isDead=!0,console.log("usagi dead QQ"))},t}(u)).prototype,"speed",[f],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 550}}),p=l))||p);r._RF.pop()}}}));

System.register("chunks:///_virtual/EnemyManager.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(e){"use strict";var n,t,r,a,i,o,s,c,u,l,p;return{setters:[function(e){n=e.applyDecoratedDescriptor,t=e.inheritsLoose,r=e.initializerDefineProperty,a=e.assertThisInitialized},function(e){i=e.cclegacy,o=e._decorator,s=e.Prefab,c=e.director,u=e.instantiate,l=e.Vec3,p=e.Component}],execute:function(){var y,g,f,h,d;i._RF.push({},"3254dS/Pl5M0K9ewyBGRjiD","EnemyManager",void 0);var m=o.ccclass,v=o.property;e("EnemyManager",(y=m("EnemyManager"),g=v({type:s}),y((d=n((h=function(e){function n(){for(var n,t=arguments.length,i=new Array(t),o=0;o<t;o++)i[o]=arguments[o];return n=e.call.apply(e,[this].concat(i))||this,r(n,"enemy_prefab",d,a(n)),n._nousagis=void 0,n}t(n,e);var i=n.prototype;return i.start=function(){var e=this,n=c.getScene().getChildByName("Canvas");this._nousagis=n.getChildByName("nousagis"),console.log(this._nousagis),this.schedule((function(){var n=u(e.enemy_prefab);n.setParent(e._nousagis);var t=620*Math.random()-310,r=new l(t,690,0);n.setPosition(r)}),5)},i.update=function(e){},n}(p)).prototype,"enemy_prefab",[g],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),f=h))||f));i._RF.pop()}}}));

System.register("chunks:///_virtual/GameManager.ts",["./rollupPluginModLoBabelHelpers.js","cc","./Enemy.ts"],(function(e){"use strict";var n,o,t,a,i,r;return{setters:[function(e){n=e.inheritsLoose,o=e.createForOfIteratorHelperLoose},function(e){t=e.cclegacy,a=e._decorator,i=e.Component},function(e){r=e.Enemy}],execute:function(){var s;e({CURR_GAME_STATE:void 0,GameState:void 0}),t._RF.push({},"b8eb9Jz2LpL2oWz+9kXwZPU","GameManager",void 0);var u,c=a.ccclass;a.property;!function(e){e[e.running=0]="running",e[e.end=1]="end"}(u||(u=e("GameState",{})));e("GameManager",c("GameManager")(s=function(t){function a(){for(var e,n=arguments.length,o=new Array(n),a=0;a<n;a++)o[a]=arguments[a];return(e=t.call.apply(t,[this].concat(o))||this)._nousagis=void 0,e.isRunning=void 0,e._gameover_objs=void 0,e}n(a,t);var i=a.prototype;return i.onLoad=function(){this.isRunning=!0,this._gameover_objs=this.node.getChildByName("gameover"),this._nousagis=this.node.getChildByName("nousagis")},i.start=function(){e("CURR_GAME_STATE",u.running),this._gameover_objs.active=!1},i.update=function(n){for(var t,a=o(this._nousagis.children);!(t=a()).done;){1==t.value.getComponent(r).isDead&&(console.log("game over"),this._gameover_objs.active=!0,e("CURR_GAME_STATE",u.end))}},a}(i))||s);t._RF.pop()}}}));

System.register("chunks:///_virtual/main",["./BackgroundManager.ts","./Bullet.ts","./BulletManager.ts","./Enemy.ts","./EnemyManager.ts","./GameManager.ts","./PlayerControl.ts","./RestartButtonControl.ts","./StartButtonControl.ts","./TitleButtonControl.ts","./test.ts"],(function(){"use strict";return{setters:[null,null,null,null,null,null,null,null,null,null,null],execute:function(){}}}));

System.register("chunks:///_virtual/PlayerControl.ts",["./rollupPluginModLoBabelHelpers.js","cc","./GameManager.ts"],(function(t){"use strict";var e,o,n,r,i,a,c,s;return{setters:[function(t){e=t.inheritsLoose},function(t){o=t.cclegacy,n=t._decorator,r=t.Node,i=t.Vec3,a=t.Component},function(t){c=t.CURR_GAME_STATE,s=t.GameState}],execute:function(){var l;o._RF.push({},"c0fbcnYftlJArml0g3QxzzK","PlayerControl",void 0);var u=n.ccclass;n.property,t("PlayerControl",u("PlayerControl")(l=function(t){function o(){for(var e,o=arguments.length,n=new Array(o),r=0;r<o;r++)n[r]=arguments[r];return(e=t.call.apply(t,[this].concat(n))||this)._peko=void 0,e}e(o,t);var n=o.prototype;return n.start=function(){var t=this;this._peko=this.node.getChildByName("pekora"),this.node.on(r.EventType.TOUCH_MOVE,(function(e){if(c==s.running){var o=new i(t._peko.position.clone());o.x+=2*e.getDelta().x,o.y+=2*e.getDelta().y,t._peko.setPosition(o);var n=!1;o.x>323?(o.x=323,n=!0):o.x<-323&&(o.x=-323,n=!0),o.y>600?(o.y=600,n=!0):o.y<-470&&(o.y=-470,n=!0),n&&t._peko.setPosition(o)}}))},n.update=function(t){},o}(a))||l);o._RF.pop()}}}));

System.register("chunks:///_virtual/RestartButtonControl.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(t){"use strict";var n,o,r,e,c;return{setters:[function(t){n=t.inheritsLoose},function(t){o=t.cclegacy,r=t._decorator,e=t.director,c=t.Component}],execute:function(){var u;o._RF.push({},"8fb67n5qFJOLby/D/hXm5Ci","RestartButtonControl",void 0);var s=r.ccclass;r.property,t("RestartButtonControl",s("RestartButtonControl")(u=function(t){function o(){return t.apply(this,arguments)||this}return n(o,t),o.prototype.callBack=function(){e.loadScene("running")},o}(c))||u);o._RF.pop()}}}));

System.register("chunks:///_virtual/StartButtonControl.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(t){"use strict";var n,o,r,e,c;return{setters:[function(t){n=t.inheritsLoose},function(t){o=t.cclegacy,r=t._decorator,e=t.director,c=t.Component}],execute:function(){var u;o._RF.push({},"c694ekV2BpDsZ3oFK0tq20E","StartButtonControl",void 0);var i=r.ccclass;r.property,t("StartButtonControl",i("StartButtonControl")(u=function(t){function o(){return t.apply(this,arguments)||this}n(o,t);var r=o.prototype;return r.start=function(){e.preloadScene("running")},r.callBack=function(){e.loadScene("running")},o}(c))||u);o._RF.pop()}}}));

System.register("chunks:///_virtual/test.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(t){"use strict";var e,n,o,r;return{setters:[function(t){e=t.inheritsLoose},function(t){n=t.cclegacy,o=t._decorator,r=t.Component}],execute:function(){var s;n._RF.push({},"4bcd8N4ASFLTJeV6NmJzrus","test",void 0);var c=o.ccclass;o.property,t("test",c("test")(s=function(t){function n(){for(var e,n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];return(e=t.call.apply(t,[this].concat(o))||this).testing_obj=void 0,e}e(n,t);var o=n.prototype;return o.start=function(){this.testing_obj=this.node.getChildByName("nousagis")},o.update=function(t){},n}(r))||s);n._RF.pop()}}}));

System.register("chunks:///_virtual/TitleButtonControl.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(t){"use strict";var o,e,n,r,c;return{setters:[function(t){o=t.inheritsLoose},function(t){e=t.cclegacy,n=t._decorator,r=t.director,c=t.Component}],execute:function(){var u;e._RF.push({},"85633fJbjNHT6aWe/rezKzM","TitleButtonControl",void 0);var i=n.ccclass;n.property,t("RestartButtonControl",i("RestartButtonControl")(u=function(t){function e(){return t.apply(this,arguments)||this}return o(e,t),e.prototype.callBack=function(){r.loadScene("title")},e}(c))||u);e._RF.pop()}}}));

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});