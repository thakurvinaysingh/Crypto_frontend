import { createSlice } from '@reduxjs/toolkit'
const uiSlice = createSlice({
  name: 'ui',
  initialState: { previewOpen: false, query: '' },
  reducers: {
    openPreview: s => { s.previewOpen = true },
    closePreview: s => { s.previewOpen = false; s.query = '' },
    setQuery: (s,a) => { s.query = a.payload }
  }
})
export const { openPreview, closePreview, setQuery } = uiSlice.actions
export default uiSlice.reducer
