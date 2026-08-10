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

    // Send the new text back to the parent component!
    this.textChange.emit(newText);

    // (Optional) Call your highlighting function here
    // this.updateHighlights(newText);
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
}
