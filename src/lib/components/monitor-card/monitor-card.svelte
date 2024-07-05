<script lang="ts">
	import CheckIcon from '@/lib/components/icons/check-icon.svelte';
	import XIcon from '@/lib/components/icons/x-icon.svelte';
	import type { TDataPoint } from '@/lib/components/monitor-card/types';
	import * as Tooltip from '@/lib/components/ui/tooltip/index';

	export let data: TDataPoint[];
	export let title: string;

	$: uptime = data.filter((item) => item.type === 'success').length / data.length;
	$: uptimePercent = uptime * 100;

	$: currentIsFail = data[data.length - 1]?.type === 'fail';

	function getDay(timestamp: number) {
		const date = new Date(timestamp);
		return date.toLocaleString(undefined, { month: 'short', day: 'numeric' });
	}
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
			class="rounded-md bg-success/15 px-1.5 py-0.75 text-center text-xs font-semibold text-success"
		>
			{uptimePercent.toLocaleString(undefined, {
				maximumFractionDigits: 2,
				minimumFractionDigits: 2
			})}%
		</p>
	</div>
	<div class="-ml-px mt-2 flex w-[calc(100%+2px)]">
		{#each data as item, index (item.id)}
			<Tooltip.Root openDelay={50} closeDelay={0} group="bars">
				<Tooltip.Trigger
					data-fail={item.type === 'fail' ? true : undefined}
					data-last={index === data.length - 1 ? true : undefined}
					data-first={index === 0 ? true : undefined}
					class="group/bar relative flex h-12 w-full cursor-default px-px hover:brightness-90 hover:saturate-150 focus-visible:outline-none focus-visible:brightness-110 focus-visible:saturate-150 dark:hover:brightness-110"
				>
					<div
						class="h-full w-full rounded-[1px] bg-success transition duration-100 group-hover/bar:scale-y-125 group-focus-visible/bar:scale-y-125 group-data-[first]/bar:rounded-l-lg group-data-[last]/bar:rounded-r-lg group-data-[fail]/bar:bg-fail"
					></div>
				</Tooltip.Trigger>
				<Tooltip.Content sideOffset={14} class="p-0">
					<div data-fail={item.type === 'fail' ? true : undefined} class="group flex flex-col">
						<div class="flex items-center justify-between gap-2 px-3.5 py-2.5">
							<div class="flex items-center pr-6">
								{#if item.type === 'fail'}
									<XIcon class="-ml-0.5 mr-1 size-5 shrink-0 text-fail" />
								{:else}
									<CheckIcon class="-ml-0.5 mr-1 size-5 shrink-0 text-success" />
								{/if}
								<p class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis font-semibold">
									{item.type === 'success' ? 'Operational' : 'Downtime'}
								</p>
							</div>
							<p class="text-sm text-foreground-muted">{getDay(item.timestamp)}</p>
						</div>
						{#if item.downtime_in_seconds > 0}
							<div class="-mt-0.5 flex items-center justify-between gap-2 px-3.5 pb-3 text-sm">
								<p class="text-foreground-muted">
									<span class="font-semibold text-fail"
										>{Math.round(item.downtime_in_seconds / 60).toLocaleString()} minutes</span
									> of downtime
								</p>
							</div>
						{/if}
						<div
							class="flex items-center justify-between gap-2 border-t border-background-secondary px-3.5 py-2.5 text-sm"
						>
							<p class="text-foreground-muted">
								<span class="font-semibold text-success">
									{(item.total_request_count - item.failed_request_count).toLocaleString()}
								</span>
								successful
								<span class="px-[0.5ch] text-background-tertiary">•</span>
								<span class="font-semibold text-fail">
									{item.failed_request_count.toLocaleString()}
								</span>
								failed
							</p>
						</div>
					</div>
				</Tooltip.Content>
			</Tooltip.Root>
		{/each}
	</div>
	<div class="mt-2 flex w-full items-center justify-between gap-4 text-xs text-foreground-muted">
		<p class="pr-4">30d ago</p>
		<p class="pl-4">Today</p>
	</div>
</div>
