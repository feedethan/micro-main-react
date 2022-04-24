import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import './index.css';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import {
  registerMicroApps,
  start,
  setDefaultMountApp,
  runAfterFirstMounted,
  addGlobalUncaughtErrorHandler,
} from 'qiankun';
// 主应用容器 和子应用容器区分
const MAIN_CONTAINER = document.getElementById('micro-main-container');

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <Routes>
        <Route path="/" element={<App />} />
      </Routes> */}
      <div className="wrap">
        <header>user info</header>
        <section className="main-body">
          <nav>
            <ul>
              <li>
                <Link to="/">主应用 home</Link>
              </li>
              <li>
                <Link to="/micro/react1/home">react 子应用-1</Link>
              </li>
              <li>
                <Link to="/micro/react1/list">react 子应用-1list</Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link to="/micro/react2/aaa">react 子应用 home 2</Link>
              </li>
              <li>
                <Link to="/micro/react2/bbb">react 子应用 list 2</Link>
              </li>
            </ul>
          </nav>
          {/* 子应用容器 对应container配置 */}
          <div id="micro-sub-container"></div>
        </section>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
  MAIN_CONTAINER
);
console.log('env', process.env.NODE_ENV);

registerMicroApps(
  [
    /**
     * name: 微应用名称 - 具有唯一性 与子应用内部无关
     * entry: 微应用入口 - 通过该地址加载微应用
     * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
     * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
     * loader: 可选，loading 状态发生变化时会调用的方法
     * props: 可选，主应用需要传递给微应用的数据
     */
    {
      name: 'sub1',
      entry:
        process.env.NODE_ENV === 'production'
          ? 'www.aaa.com'
          : '//localhost:3001',
      container: '#micro-sub-container',
      activeRule: '/micro/react1',
      props: {
        data: { msg: 'this is from main app!' },
      },
      loader: (loading) => {
        console.log('loading:', loading);
      },
    },
    {
      name: 'sub-2',
      entry: '//localhost:5000/',
      activeRule: '/micro/react2',
      container: '#micro-sub-container',
      props: {},
    },
  ],
  {
    beforeLoad: (app) => {
      console.log('before load app.name====>>>>>', app.name);
      NProgress.start();
    },
    beforeMount: [
      (app) => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
      },
    ],
    afterMount: [
      (app) => {
        console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name);
        NProgress.done();
      },
    ],
    afterUnmount: [
      (app) => {
        console.log(
          '[LifeCycle] after unmount %c%s',
          'color: green;',
          app.name
        );
      },
    ],
  }
);

start();

runAfterFirstMounted(() => {
  console.log('[MainApp] first app mounted');
});

// 添加全局的未捕获异常处理器
addGlobalUncaughtErrorHandler((event) =>
  console.log('caught by qiankun:', event)
);
