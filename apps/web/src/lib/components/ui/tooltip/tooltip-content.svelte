<script lang="ts">
	import { Tooltip as TooltipPrimitive } from 'bits-ui';
	import { cn, flyAndScale } from '@/lib/ts/utils.js';

	type $$Props = TooltipPrimitive.ContentProps;

	let className: $$Props['class'] = undefined;
	export let sideOffset: $$Props['sideOffset'] = 4;
	export let transition: $$Props['transition'] = flyAndScale;
	export let transitionConfig: $$Props['transitionConfig'] = {
		y: 8,
		duration: 150
	};
	export { className as class };
</script>

<TooltipPrimitive.Content
	{transition}
	{transitionConfig}
	{sideOffset}
	class={cn(
		'shadow-shadow/[var(--o-shadow)] z-50 overflow-hidden rounded-xl border border-background-secondary bg-background px-3 py-1.5 text-foreground shadow-lg',
		className
	)}
	{...$$restProps}
>
	<slot />
</TooltipPrimitive.Content>
