<script>
import { getContext } from 'svelte'

export let row

let tr

const store = getContext('store')
let customSelection = store.customSelection
let selectedRows = store.selectedRows
let selectedClass = store.selectedClass

$: isSelected = $selectedRows.find(it => it === row) !== undefined

$: rowClass = (() => {
    let classes = []

    if (isSelected) {
        classes.push($selectedClass)
    }

    if (!$customSelection) {
        classes.push('st-selectable')
    }

    return classes.join(' ')
})()

function handleRowSelected (event) {
    if ($customSelection) {
        return
    }

    let source = event.target || event.srcElement
    if (source.tagName.toLowerCase() === 'td') {
        if (isSelected) {
            store.deselectRow(row)
        } else {
            store.selectRow(row)
        }
    }

}
</script>

<style>
    tr.st-selectable {
        cursor: pointer
    }
</style>

<tr
        bind:this="{tr}"
        class="{rowClass + ' ' + $$props.class}"
        on:click="{handleRowSelected}"
>
    <slot></slot>
</tr>