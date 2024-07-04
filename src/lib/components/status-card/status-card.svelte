<script lang="ts">
	import CheckIcon from '@components/icons/check-icon.svelte';
	import XIcon from '@components/icons/x-icon.svelte';
	import type { TDataPoint } from '@components/status-card/types';

	export let data: TDataPoint[];
	export let title: string;

	$: uptime = data.filter((item) => item.type === 'success').length / data.length;
	$: uptimePercent = uptime * 100;

	$: currentIsFail = data[data.length - 1]?.type === 'fail';
</script>

<div
	data-current-is-fail={currentIsFail ? true : undefined}
	class="group flex w-full max-w-md flex-col gap-3"
>
	<div class="flex w-full items-center justify-start">
		<div class="flex items-center pr-6">
			{#if currentIsFail}
				<XIcon class="-ml-0.5 mr-1 size-5 text-fail" />
			{:else}
				<CheckIcon class="-ml-0.5 mr-1 size-5 text-success" />
			{/if}
			<h2 class="text-xl font-bold">
				{title}
			</h2>
		</div>
		<div class="mr-px h-px w-full flex-1 rounded-l-full bg-foreground/20"></div>
		<p
			class="rounded-md bg-foreground/10 px-1.5 py-0.5 text-center text-xs font-medium text-foreground ring-1 ring-foreground/20"
		>
			{uptimePercent.toLocaleString(undefined, {
				maximumFractionDigits: 2
			})}%
		</p>
	</div>
	<div class="flex w-full gap-0.5 overflow-hidden rounded-md">
		{#each data as item (item.id)}
			<div
				data-fail={item.type === 'fail' ? true : undefined}
				class="flex h-10 w-full bg-success data-[fail]:bg-fail"
			></div>
		{/each}
	</div>
</div>
