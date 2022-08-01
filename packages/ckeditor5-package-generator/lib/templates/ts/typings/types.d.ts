declare module '*.svg' {
	const content: string;
	export default content;
}

declare module 'ckeditor5/src/core' {
	export * from 'ckeditor__ckeditor5-core';
}

declare module 'ckeditor5/src/ui' {
	export * from 'ckeditor__ckeditor5-ui';
}
