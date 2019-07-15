<script>
import { getStore } from './store'
import { doSort, doPaginate, doFilter, calculateTotalPages } from './table-utils'
import { createEventDispatcher, setContext, onMount } from 'svelte'

export let data
export let filters = null
export let currentPage = null
export let pageSize = null
export let allowSelection = false
export let selectionMode = 'single'
export let selectedClass = 'st-selected'
export let customSelection = false
export let hideSortIcons = false

const dispatch = createEventDispatcher()

let initialLoad = false

const store = getStore()
setContext('store', store)
let customSort = store.customSort
let sortKey = store.sortKey
let sortOrder = store.sortOrder
let selectedRows = store.selectedRows

$: filteredData = data.length === 0 ? [] : (typeof filters !== 'object' ? data : doFilter(data, filters))

$: totalItems = filteredData.length

$: totalPages = !pageSize ? 0 : calculateTotalPages(totalItems, pageSize)

$: needsPaginationReset = currentPage > totalPages

$: sortedData = (() => {
    if (($sortKey || $customSort) && $sortOrder !== 0) {
        return doSort(filteredData, $sortKey, $customSort, $sortOrder)
    } else {
        return filteredData
    }
})()

$: displayData = pageSize ? doPaginate(sortedData, pageSize, currentPage) : sortedData

$: {
    if (!initialLoad) {
        initialLoad = true
        dispatch('loaded')
    }
}

$: store.selectionMode.set(selectionMode)
$: store.selectedClass.set(selectedClass)
$: store.customSelection.set(customSelection)
$: store.hideSortIcons.set(hideSortIcons)
$: if (currentPage > totalPages) {
    currentPage = 1
}

$: dispatch('totalPagesChanged', totalPages)
$: dispatch('totalItemsChanged', totalItems)
$: dispatch('selectionChanged', $selectedRows)

onMount(() => {
    dispatch('totalPagesChanged', totalPages)
    dispatch('totalItemsChanged', totalItems)
    dispatch('selectionChanged', $selectedRows)
})

</script>

<table class="{$$props.class}">
    <slot name="head"/>
    <slot name="body" {displayData}/>
</table>