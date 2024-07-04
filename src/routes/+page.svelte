<script lang="ts">
	import CheckIcon from '@components/icons/check-icon.svelte';
	import Check from '@components/icons/check-icon.svelte';
	import StatusCard from '@components/status-card/status-card.svelte';
	import type { TDataPoint } from '@components/status-card/types';

	function generateData() {
		return Array.from({ length: 30 }, (_, i) => ({
			id: i,
			type: Math.random() > 0.1 ? 'success' : 'fail'
		})) as TDataPoint[];
	}

	const data1: TDataPoint[] = generateData();
	const data2: TDataPoint[] = generateData();
	const data3: TDataPoint[] = generateData();
	const data4: TDataPoint[] = generateData();
</script>

<main class="flex w-full flex-col items-center justify-start px-5">
	<div class="flex w-full flex-col items-center">
		<CheckIcon class="size-12 text-success" />
		<h1 class="mt-2 text-balance text-center text-3xl font-bold">All Systems Operational</h1>
	</div>
	<div class="mt-14 flex w-full max-w-3xl flex-col items-center justify-start gap-14">
		<StatusCard data={data1} title="Website" />
		<StatusCard data={data2} title="Worker" />
		<StatusCard data={data3} title="Translator" />
		<StatusCard data={data4} title="CLIP" />
	</div>
</main>
