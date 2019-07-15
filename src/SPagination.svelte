<script>
export let currentPage
export let totalPages
export let hideSinglePage = true
export let maxPageLinks = NaN
export let boundaryLinks = false
export let firstText = 'First'
export let lastText = 'Last'
export let directionLinks = true

$: displayPages = (() => {
    function displayAllPages () {
        const displayPages = []

        for (let i = 1; i <= totalPages; i++) {
            displayPages.push({
                title: i.toString(),
                value: i
            })
        }
        return displayPages
    }

    function limitVisiblePages () {
        const displayPages = []

        const totalTiers = Math.ceil(totalPages / maxPageLinks)

        const activeTier = Math.ceil(currentPage / maxPageLinks)

        const start = ((activeTier - 1) * maxPageLinks) + 1
        const end = start + maxPageLinks

        if (activeTier > 1) {
            displayPages.push({
                title: '...',
                value: start - 1
            })
        }

        for (let i = start; i < end; i++) {
            if (i > totalPages) {
                break
            }

            displayPages.push({
                title: i.toString(),
                value: i
            })
        }

        if (activeTier < totalTiers) {
            displayPages.push({
                title: '...',
                value: end
            })
        }

        return displayPages
    }

    if (isNaN(maxPageLinks) || maxPageLinks <= 0) {
        return displayAllPages()
    } else {
        return limitVisiblePages()
    }
})()

function selectPage (page) {
    if (page < 1 || page > totalPages || page === currentPage) {
        return
    }

    currentPage = page
}

function nextPage () {
    if (currentPage < totalPages) {
      currentPage++
    }
}

function previousPage () {
    if (currentPage > 1) {
      currentPage--
    }
}

function firstPage () {
    currentPage = 1
}

function lastPage () {
    currentPage = totalPages
}


</script>

<style>
    .disabled svg {
        color: grey;
    }

    .disabled a {
        cursor: not-allowed
    }
</style>

{#if !(hideSinglePage && totalPages === 1)}
<nav class="smart-pagination">
    <ul class="pagination">
        {#if boundaryLinks}
        <li class:disabled="{currentPage === 1}" class="page-item">
            <a href="javascript:void(0)" aria-label="Previous" on:click="{firstPage}" class="page-link">
                <span aria-hidden="true">{@html firstText}</span>
            </a>
        </li>
        {/if}

        {#if directionLinks }
        <li class:disabled="{currentPage === 1}" class="page-item">
            <a href="javascript:void(0)" aria-label="Previous" on:click="{previousPage}" class="page-link">
                <slot name="previousIcon" disabled="{currentPage === 1}">
                    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path fill="currentColor"
                              d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
                    </svg>
                </slot>
            </a>
        </li>
        {/if}

        {#each displayPages as page (page.value)}
        <li class="page-item" class:active="{currentPage === page.value}">
            <a href="javascript:void(0)" on:click="{() => selectPage(page.value)}" class="page-link">{page.title}</a>
        </li>
        {/each}

        {#if directionLinks}
        <li class:disabled="{currentPage === totalPages}" class="page-item">
            <a href="javascript:void(0)" aria-label="Next" on:click="{nextPage}" class="page-link">
                <slot name="nextIcon" disabled="{currentPage === totalPages}">
                    <svg width="16" height="16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path fill="currentColor"
                              d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
                    </svg>
                </slot>
            </a>
        </li>
        {/if}

        {#if boundaryLinks}
        <li class:disabled="{currentPage === totalPages}" class="page-item">
            <a href="javascript:void(0)" aria-label="Previous" on:click="{lastPage}" class="page-link">
                <span aria-hidden="true" v-html="lastText"></span>
            </a>
        </li>
        {/if}
    </ul>
</nav>
{/if}