<script lang="ts">
	import CheckIcon from '@/lib/components/icons/check-icon.svelte';
	import MonitorCard from '@/lib/components/monitor-card/monitor-card.svelte';
	import type { TDataPoint } from '@/lib/components/monitor-card/types';
	import { monitors } from '@root/monitor.config';

	function generateData() {
		const length = 30;
		return Array.from({ length: length }, (_, i) => ({
			id: i,
			type: Math.random() > 0.1 ? 'success' : 'fail',
			timestamp: Date.now() - (length - 1 - i) * 60 * 60 * 24 * 1000
		})) as TDataPoint[];
	}

	const monitorsWithData = monitors.map((monitor) => ({
		...monitor,
		data: generateData()
	}));
</script>

<main class="flex w-full flex-1 flex-col items-center justify-start px-5 pb-24 pt-12">
	<div class="my-auto flex w-full flex-col items-center">
		<div class="flex w-full flex-col items-center">
			<CheckIcon class="text-success size-10" />
			<h1 class="mt-2 text-balance text-center text-2xl font-bold">All Systems Operational</h1>
		</div>
		<div class="mt-10 flex w-full max-w-3xl flex-col items-center justify-start gap-10">
			{#each monitorsWithData as { data, title }, i}
				<MonitorCard {data} {title} />
			{/each}
		</div>
	</div>
</main>
