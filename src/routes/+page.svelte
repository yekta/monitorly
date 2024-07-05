<script lang="ts">
	import CheckIcon from '@/lib/components/icons/check-icon.svelte';
	import MonitorCard from '@/lib/components/monitor-card/monitor-card.svelte';

	export let data;

	const { monitors } = data;
</script>

<main class="flex w-full flex-1 flex-col items-center justify-start px-5 pb-24 pt-12">
	<div class="my-auto flex w-full flex-col items-center">
		<div class="flex w-full flex-col items-center">
			<CheckIcon class="size-10 text-success" />
			<h1 class="mt-2 text-balance text-center text-2xl font-bold">All Systems Operational</h1>
		</div>
		<div class="mt-10 flex w-full max-w-3xl flex-col items-center justify-start gap-10">
			{#each monitors as { data, title }, i}
				<MonitorCard {data} {title} />
			{/each}
		</div>
	</div>
</main>
