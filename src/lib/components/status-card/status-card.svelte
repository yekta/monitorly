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
	class="group flex w-full max-w-md flex-col"
>
	<div class="flex w-full items-center justify-start">
		<div class="flex items-center pr-4">
			{#if currentIsFail}
				<XIcon class="-ml-0.5 mr-1 size-5 text-fail" />
			{:else}
				<CheckIcon class="-ml-0.5 mr-1 size-5 text-success" />
			{/if}
			<h2 class="text-xl font-bold">
				{title}
			</h2>
		</div>
		<div
			class="h-1.5px w-full flex-1 rounded-l-full bg-gradient-to-r from-background-secondary/0 to-background-secondary to-[33%]"
		></div>
		<p
			class="rounded-md bg-background-secondary px-1.5 py-0.75 text-center text-xs font-medium text-foreground-faded"
		>
			{uptimePercent.toLocaleString(undefined, {
				maximumFractionDigits: 2,
				minimumFractionDigits: 2
			})}%
		</p>
	</div>
	<div class="mt-2.5 flex w-full overflow-hidden rounded-lg">
		{#each data as item, index (item.id)}
			<div
				data-last={index === data.length - 1 ? true : undefined}
				class="flex h-12 w-full pr-1.5px hover:brightness-[1.3] data-[last]:p-0"
			>
				<div
					data-fail={item.type === 'fail' ? true : undefined}
					class="h-full w-full bg-success data-[fail]:bg-fail"
				></div>
			</div>
		{/each}
	</div>
	<div
		class="mt-2.5 flex w-full items-center justify-between gap-4 text-xs font-medium text-foreground-faded-more"
	>
		<p class="pr-4">30d ago</p>
		<p class="pl-4">Today</p>
	</div>
</div>
