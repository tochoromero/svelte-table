import { writable, get, derived } from 'svelte/store'

export const getStore = () => {
  const state = {
    selectedRows: writable([]),
    selectionMode: writable('single'),
    customSelection: writable(null),
    selectedClass: writable(null),
    hideSortIcons: writable(null),
    sortId: writable(null),
    sortKey: writable(null),
    customSort: writable(null),
    sortOrder: writable(null),
    currentPage: writable(-1),
    totalPages: writable(-1)
  }

  const actions = {
    selectRow (row) {
      if (get(state.selectionMode) === 'single') {
        state.selectedRows.set([row])
      }

      let selected = get(state.selectedRows)
      const index = selected.indexOf(row)
      if (index === -1) {
        state.selectedRows.set([...selected, row])
      }
    },
    selectRows (rows) {
      for (let row of rows) {
        actions.selectRow(row)
      }
    },
    deselectRow (row) {
      let selected = get(state.selectedRows)
      const index = selected.indexOf(row)

      if (index > -1) {
        selected = selected.splice(index, 1)
        state.selectedRows.set(selected)
      }
    },
    deselectRows (rows) {
      for (let row of rows) {
        actions.deselectRow(row)
      }
    },
    selectAll (all) {
      state.selectedRows.set(all)
    },
    deselectAll () {
      state.selectedRows.set([])
    },
    setSort ({ sortKey, customSort, sortOrder, sortId }) {
      state.sortKey.set(sortKey)
      state.customSort.set(customSort)
      state.sortOrder.set(sortOrder)
      state.sortId.set(sortId)
    }
  }

  return {
    ...state,
    ...actions
  }
}