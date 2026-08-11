import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { format } from 'sql-formatter';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-textarea-highlight',
  templateUrl: './textarea-highlight.component.html',
  styleUrls: ['./textarea-highlight.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaHighlightComponent),
      multi: true,
    },
  ],
})
export class TextareaHighlightComponent implements ControlValueAccessor {
  constructor() { }
  @Input() LogicalOperators: string[] = [];
  @Input() ConditionalClause: string[] = [];
  @Input() functionNames: string[] = [];
  @Input() dataBaseObject: string[] = [];
  // 1. Accept the incoming text from the parent
  @Input() text: string = '';

  // 2. Create an event emitter to send the updated text back
  // (Must be named: inputName + "Change")
  @Output() textChange = new EventEmitter<string>();

  @ViewChild('backdrop') $backdrop: ElementRef<HTMLDivElement>;
  @ViewChild('textarea') $textarea: ElementRef<HTMLTextAreaElement>;
  textValue: string = '';
  valueList: any = [];
  singleQuoteValueList: any = [];
  patterns: any = /".*?"/g;
  singleQuaotePatterns: any = /'.*?'/g;
  current: any;
  get highlightedText() {
    return this.applyHighlights(this.text);
  }
  // 3. This function triggers every time the user types
  onTextareaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const newText = textarea.value;

    // Update local value
    this.text = newText;

    // Send to parent
    this.textChange.emit(newText);

    // Notify Angular forms
    if (this.onChanges) {
      this.onChanges(newText);
    }
  }


  applyHighlights(text: string) {

    text = text ? text.replace(/\n$/g, '\n\n') : '';

    this.valueList = [];
    while ((this.current = this.patterns.exec(text))) {
      this.valueList.push(this.current[0]);
    }

    this.singleQuoteValueList = [];
    while ((this.current = this.singleQuaotePatterns.exec(text))) {
      this.singleQuoteValueList.push(this.current[0]);
    }

    // --------------------------------
    // 1. Protect SQL comments
    // --------------------------------
    const comments: string[] = [];

    text = text.replace(/--[^\n\r]*/g, (comment) => {
      const index = comments.length;

      comments.push(
        `<span class="sql_comment">${comment}</span>`
      );

      return `___SQL_COMMENT_${index}___`;
    });


    // --------------------------------
    // 2. Logical operators
    // --------------------------------
    this.LogicalOperators
      .sort((a, b) => b.length - a.length)
      .forEach((x) => {

        const escaped = x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        text = text.replace(
          new RegExp(`\\b${escaped}\\b`, 'gi'),
          '<span class="logical_operators">$&</span>'
        );
      });


    // --------------------------------
    // 3. Conditional clauses
    // --------------------------------
    this.ConditionalClause
      .sort((a, b) => b.length - a.length)
      .forEach((x) => {

        const escaped = x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        text = text.replace(
          new RegExp(`\\b${escaped}\\b`, 'gi'),
          '<span class="conditional_clause">$&</span>'
        );
      });


    // --------------------------------
    // 4. Functions
    // --------------------------------
    this.functionNames.forEach((x) => {

      const escaped = x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      text = text.replace(
        new RegExp(`\\b${escaped}\\s*\\(`, 'gi'),
        '<span class="function_names">$&</span>'
      );
    });


    // --------------------------------
    // 5. Database objects
    // --------------------------------
    this.dataBaseObject.forEach((x) => {

      const escaped = x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      text = text.replace(
        new RegExp(`\\b${escaped}\\b`, 'gi'),
        '<span class="database_objects">$&</span>'
      );
    });


    // --------------------------------
    // 6. Double quoted values
    // --------------------------------
    this.valueList.forEach((x) => {

      const escaped = x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      text = text.replace(
        new RegExp(escaped, 'gi'),
        '<span class="quoted_words">$&</span>'
      );
    });


    // --------------------------------
    // 7. Single quoted values
    // --------------------------------
    this.singleQuoteValueList.forEach((x) => {

      const escaped = x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      text = text.replace(
        new RegExp(escaped, 'gi'),
        '<span class="quoted_words">$&</span>'
      );
    });


    // --------------------------------
    // 8. Restore comments LAST
    // --------------------------------
    comments.forEach((comment, index) => {

      text = text.replace(
        `___SQL_COMMENT_${index}___`,
        comment
      );

    });


    return text;
  }
  handleScroll() {
    var scrollTop = this.$textarea.nativeElement.scrollTop;
    this.$backdrop.nativeElement.scrollTop = scrollTop;

    var scrollLeft = this.$textarea.nativeElement.scrollLeft;
    this.$backdrop.nativeElement.scrollLeft = scrollLeft;
  }

  onChanges: ($value: any) => void;
  onTouched: () => void;

  writeValue(value: any): void {
    if (value !== undefined) {
      this.textValue = value;
    }
  }
  registerOnChange(fn: any): void {
    this.onChanges = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }



  fixOracleKeywords(sql: string): string {

    return sql

      // CREATE OR REPLACE
      .replace(
        /\bCREATE\s*\n\s*OR\s+REPLACE\b/gi,
        'CREATE OR REPLACE'
      )

      // INSERT INTO
      .replace(
        /\bINSERT\s*\n\s*INTO\b/gi,
        'INSERT INTO'
      )

      // INSERT INTO + table
      .replace(
        /\bINSERT\s+INTO\s*\n\s*([A-Za-z0-9_$#."']+)/gi,
        'INSERT INTO $1'
      )

      // UPDATE remains together naturally
      // DELETE FROM
      .replace(
        /\bDELETE\s*\n\s*FROM\b/gi,
        'DELETE FROM'
      )

      // SELECT INTO
      .replace(
        /\bSELECT\s*\n\s*INTO\b/gi,
        'SELECT INTO'
      );
  }

  sqlFormatar() {

    const sql = this.text?.trim();

    if (!sql) {
      return;
    }

    if (
      /^\s*CREATE\s+(OR\s+REPLACE\s+)?(NONEDITIONABLE\s+)?(FUNCTION|PROCEDURE|PACKAGE|TRIGGER)\b/i
        .test(sql)
    ) {

      this.text = this.formatOraclePLSQL(sql);

    } else {

      this.text = format(sql, {
        language: 'plsql'
      });

    }
  }

 formatOraclePLSQL(sql: string): string {

  const INDENT = '        '; // 8 spaces

  let level = 0;
  let parenLevel = 0;

  // Keep track of opening blocks
  const blockStack: string[] = [];

  const result: string[] = [];

  // -----------------------------------------
  // Normalize line endings
  // -----------------------------------------

  sql = sql
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  const lines = sql.split('\n');

  for (let rawLine of lines) {

    let line = rawLine.trim();

    if (!line) {
      result.push('');
      continue;
    }

    // -----------------------------------------
    // Comments
    // -----------------------------------------

    if (/^--/.test(line)) {
      result.push(
        INDENT.repeat(level) + line
      );
      continue;
    }


    // =========================================
    // CLOSING BLOCKS
    // =========================================

    if (/^END\s+IF\b/i.test(line)) {

      level = Math.max(0, level - 1);

      result.push(
        INDENT.repeat(level) + line
      );

      if (blockStack.length) {
        blockStack.pop();
      }

      continue;
    }


    if (/^END\s+LOOP\b/i.test(line)) {

      level = Math.max(0, level - 1);

      result.push(
        INDENT.repeat(level) + line
      );

      if (blockStack.length) {
        blockStack.pop();
      }

      continue;
    }


    if (/^END\s+CASE\b/i.test(line)) {

      level = Math.max(0, level - 1);

      result.push(
        INDENT.repeat(level) + line
      );

      if (blockStack.length) {
        blockStack.pop();
      }

      continue;
    }


    // END PROCEDURE / FUNCTION / PACKAGE
    if (
      /^END\s+[A-Za-z_][A-Za-z0-9_$#]*\s*;/i.test(line)
    ) {

      level = Math.max(0, level - 1);

      result.push(
        INDENT.repeat(level) + line
      );

      if (blockStack.length) {
        blockStack.pop();
      }

      continue;
    }


    // END;
    if (/^END\s*;/i.test(line)) {

      level = Math.max(0, level - 1);

      result.push(
        INDENT.repeat(level) + line
      );

      if (blockStack.length) {
        blockStack.pop();
      }

      continue;
    }


    // =========================================
    // ELSE / ELSIF
    // =========================================

    if (
      /^ELSE\b/i.test(line) ||
      /^ELSIF\b/i.test(line)
    ) {

      // Close previous IF branch
      level = Math.max(0, level - 1);

      result.push(
        INDENT.repeat(level) + line
      );

      // Open new branch
      level++;

      continue;
    }


    // =========================================
    // EXCEPTION
    // =========================================

    if (/^EXCEPTION\b/i.test(line)) {

      level = Math.max(0, level - 1);

      result.push(
        INDENT.repeat(level) + line
      );

      level++;

      continue;
    }


    // =========================================
    // Closing parenthesis
    // =========================================

    if (line.startsWith(')')) {
      parenLevel = Math.max(0, parenLevel - 1);
    }


    // =========================================
    // INSERT INTO
    // =========================================

    if (/^INSERT\s+INTO\b/i.test(line)) {

      result.push(
        INDENT.repeat(level) + line
      );

      if (line.includes('(')) {
        parenLevel++;
      }

      continue;
    }


    // =========================================
    // VALUES
    // =========================================

    if (/^VALUES\b/i.test(line)) {

      result.push(
        INDENT.repeat(level) + line
      );

      if (line.includes('(')) {
        parenLevel++;
      }

      continue;
    }


    // =========================================
    // Normal line
    // =========================================

    result.push(
      INDENT.repeat(level + parenLevel) + line
    );


    // =========================================
    // Parentheses
    // =========================================

    if (
      !/^INSERT\s+INTO\b/i.test(line) &&
      !/^VALUES\b/i.test(line)
    ) {

      const openCount =
        (line.match(/\(/g) || []).length;

      const closeCount =
        (line.match(/\)/g) || []).length;

      parenLevel += openCount - closeCount;

      if (parenLevel < 0) {
        parenLevel = 0;
      }
    }


    // =========================================
    // BEGIN
    // =========================================

    if (/^BEGIN\b/i.test(line)) {

      blockStack.push('BEGIN');

      level++;

      continue;
    }


    // =========================================
    // IF ... THEN
    // =========================================

    if (
      /^IF\b/i.test(line) &&
      /\bTHEN\b/i.test(line)
    ) {

      blockStack.push('IF');

      level++;

      continue;
    }


    // =========================================
    // LOOP
    // =========================================

    if (
      /\bLOOP\b/i.test(line) &&
      !/^END\s+LOOP/i.test(line)
    ) {

      blockStack.push('LOOP');

      level++;

      continue;
    }


    // =========================================
    // CASE
    // =========================================

    if (/^CASE\b/i.test(line)) {

      blockStack.push('CASE');

      level++;

      continue;
    }
  }

  return result.join('\n');
}

}
