import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import styles from './index.module.css'
import { Layout } from './layout'

const el = document.querySelector('.root')
el.className = styles.root

const root = createRoot(el)

root.render(
  <RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  </RecoilRoot>,
)
