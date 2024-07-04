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
	class="group flex w-full max-w-lg flex-col"
>
	<div class="flex w-full flex-wrap items-center justify-start gap-0.5">
		<div class="flex flex-1 items-center pr-4">
			{#if currentIsFail}
				<XIcon class="-ml-0.5 mr-1 size-5 shrink-0 text-fail" />
			{:else}
				<CheckIcon class="-ml-0.5 mr-1 size-5 shrink-0 text-success" />
			{/if}
			<h2 class="flex-1 text-lg font-bold">
				{title}
			</h2>
		</div>
		<p
			class="rounded-md bg-background-secondary px-1.5 py-0.75 text-center text-xs font-medium text-foreground-faded"
		>
			{uptimePercent.toLocaleString(undefined, {
				maximumFractionDigits: 2,
				minimumFractionDigits: 2
			})}%
		</p>
	</div>
	<div class="-ml-px mt-2 flex w-[calc(100%+2px)]">
		{#each data as item, index (item.id)}
			<div
				data-last={index === data.length - 1 ? true : undefined}
				data-first={index === 0 ? true : undefined}
				class="group/bar relative flex h-12 w-full px-px hover:brightness-110 hover:saturate-150"
			>
				<div
					data-fail={item.type === 'fail' ? true : undefined}
					class="h-full w-full rounded-[1px] bg-success transition duration-100 group-hover/bar:scale-y-125 data-[fail]:bg-fail group-data-[first]/bar:rounded-l-lg group-data-[last]/bar:rounded-r-lg"
				></div>
			</div>
		{/each}
	</div>
	<div
		class="mt-2 flex w-full items-center justify-between gap-4 text-xs font-medium text-foreground-faded-more"
	>
		<p class="pr-4">30d ago</p>
		<p class="pl-4">Today</p>
	</div>
</div>
