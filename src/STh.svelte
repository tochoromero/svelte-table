<script>
import { getContext, onMount, tick, createEventDispatcher} from 'svelte'
import { uuid } from './table-utils'

export let sortKey
export let customSort = null
export let defaultSort = null

const dispatch = createEventDispatcher()

const store = getContext('store')

let hideSortIcons = store.hideSortIcons
let sortId = store.sortId

let id = uuid()
let sortOrder = 0
let orderClasses = ['vt-desc', 'vt-sortable', 'vt-asc']

$: sortEnabled = sortKey || typeof customSort === 'function'

$: sortClass = $hideSortIcons ? [orderClasses[sortOrder + 1], 'st-sort'] : []

$: if ($sortId !== id && sortOrder !== 0) {
    sortOrder = 0
}

onMount(async () => {
    if (!sortKey && !customSort) {
        throw new Error('Must provide the Sort Key value or a Custom Sort function.')
    }

    if (defaultSort) {
        sortOrder = defaultSort === 'desc' ? -1 : 1
        store.setSort({
            sortOrder,
            sortKey,
            customSort,
            sortId: id
        })

        await tick()
        dispatch('defaultSort')
    }
})

function sort () {
    if (sortEnabled) {
        sortOrder = sortOrder === 0 || sortOrder === -1 ? sortOrder + 1 : -1
        store.setSort({
            sortOrder,
            sortKey,
            customSort,
            sortId: id
        })
    }
}
</script>

<style>
    .st-sort {
        cursor: pointer
    }
</style>

<th
        on:click="{sort}"
        class="{sortClass.join(' ') + ' ' + $$props.class}"
>
    {#if !$hideSortIcons}
        {#if sortOrder === -1}
        <slot name="ascIcon">
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path fill="currentColor"
                      d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path>
            </svg>
        </slot>
        {:else if sortOrder === 0}
        <slot name="sortIcon">
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path fill="currentColor"
                      d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path>
            </svg>
        </slot>
        {:else if sortOrder === 1}
        <slot name="descIcon">
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path fill="currentColor"
                      d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
            </svg>
        </slot>
        {/if}
    {/if}
    <slot></slot>
</th>