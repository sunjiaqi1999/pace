/*
 * @Author: sunjiaqi001 sunjiaqi001@51talk.com
 * @Date: 2026-03-17 16:03:06
 * @LastEditors: sunjiaqi001 sunjiaqi001@51talk.com
 * @LastEditTime: 2026-03-17 18:00:51
 * @FilePath: /pace/pace-web/src/main.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
