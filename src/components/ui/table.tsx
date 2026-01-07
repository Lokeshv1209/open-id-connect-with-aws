"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const TableComponent = React.memo(function Table({
  className,
  ...props
}: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
});

const TableHeaderComponent = React.memo(function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("", className)} {...props} />;
});

const TableBodyComponent = React.memo(function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("", className)} {...props} />;
});

const TableFooterComponent = React.memo(function TableFooter({
  className,
  ...props
}: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("bg-muted/50 font-medium", className)}
      {...props}
    />
  );
});

const TableRowComponent = React.memo(function TableRow({
  className,
  ...props
}: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted  transition-colors",
        className
      )}
      {...props}
    />
  );
});

const TableHeadComponent = React.memo(function TableHead({
  className,
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
});

const TableCellComponent = React.memo(function TableCell({
  className,
  ...props
}: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
});

const TableCaptionComponent = React.memo(function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
});

TableComponent.displayName = "Table";
TableHeaderComponent.displayName = "TableHeader";
TableBodyComponent.displayName = "TableBody";
TableFooterComponent.displayName = "TableFooter";
TableRowComponent.displayName = "TableRow";
TableHeadComponent.displayName = "TableHead";
TableCellComponent.displayName = "TableCell";
TableCaptionComponent.displayName = "TableCaption";

export {
  TableComponent as Table,
  TableBodyComponent as TableBody,
  TableCaptionComponent as TableCaption,
  TableCellComponent as TableCell,
  TableFooterComponent as TableFooter,
  TableHeadComponent as TableHead,
  TableHeaderComponent as TableHeader,
  TableRowComponent as TableRow,
};
