import { createRoot } from 'react-dom/client'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import './index.css'
import App from './App.tsx'

const system = createSystem(defaultConfig)

createRoot(document.getElementById('root')!).render(
    <ChakraProvider value={system}>
      <App />
    </ChakraProvider>
)
