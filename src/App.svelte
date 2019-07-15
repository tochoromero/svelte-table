<script>
import STable from './STable.svelte'
import STh from './STh.svelte'
import STr from './STr.svelte'
import SPagination from './SPagination.svelte'

export let name

let data = [
    { name: 'a' },
    { name: 'b' },
    { name: 'c' },
    { name: 'd' },
    { name: 'e' },
    { name: 'f' },
    { name: 'g' },
    { name: 'h' },
    { name: 'i' },
]

let filters = {
  name: {value: '', keys: ['name']}
}

let pageSize = 5
let totalPages = 0
let currentPage = 1

function totalPagesChanged (e) {
  totalPages = e.detail
}
</script>

<style>
    h1 {
        color: purple;
    }
</style>

<h1>Hello {name}! caca</h1>

<input bind:value="{filters.name.value}"/>

<STable {data} {filters} {pageSize} {currentPage}
        class="table"
        selectedClass="table-info"
        on:totalPagesChanged="{totalPagesChanged}"
>
    <thead slot="head">
    <STh sortKey="name" defaultSort="asc">Name</STh>
    </thead>
    <tbody slot="body" let:displayData="{displayData}">
        {#each displayData as row (row.name)}
            <STr {row}>
                <td>{row.name}</td>
            </STr>
        {/each}
    </tbody>
</STable>

<SPagination {totalPages} bind:currentPage="{currentPage}"/>
