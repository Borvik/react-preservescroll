# @borvik/react-preservescroll

Provides a react component that is a drop-in replacement for a scrollable `<div>`.  All your css still applies to make it scrollable.  This just attaches handlers to record and restore the scroll position when you navigate the page either via history operations, or standard navigation.

The only difference from a `<div>` is that an `id` prop is _required_.