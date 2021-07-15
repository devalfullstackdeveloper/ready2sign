
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightSearch'
})
// export class HighlightSearchPipe implements PipeTransform {

//   transform(value: string, search: string): string {
//     return value.replace(new RegExp('(?![^&;]+;)(?!<[^<>]*)(' + search + ')(?![^<>]*>)(?![^&;]+;)', 'gi'), '<strong >$1</strong>');
//   }
// }

export class HighlightSearchPipe implements PipeTransform {
    transform(text: string, [search]): string {
      return search ? text.replace(new RegExp(search, 'i'), `<span class="highlight">${search}</span>`) : text;
    }
  }