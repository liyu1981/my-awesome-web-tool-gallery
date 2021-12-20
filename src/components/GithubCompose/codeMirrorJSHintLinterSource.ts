import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@uiw/react-codemirror';
import { JSHINT } from 'jshint';
import { Text } from '@codemirror/text';

function mapPos(line: number, col: number, doc: Text) {
  let pos = doc.line(line).from + col;
  if (pos < 0) {
    pos = 0;
  }
  if (pos >= doc.length) {
    pos = doc.length - 1;
  }
  return pos;
}

export function getJSHintLinterSource(onCodeIsValid: () => void) {
  return function (view: EditorView) {
    const { state } = view;
    const found: Diagnostic[] = [];
    const success = JSHINT(state.sliceDoc(0));
    if (success) {
      onCodeIsValid();
    } else {
      for (let i in JSHINT.errors) {
        const error = JSHINT.errors[i];
        // console.log('error:', error);
        if (error.id === '(error)') {
          found.push({
            from: mapPos(
              error.line,
              error.character - error.evidence.length,
              state.doc,
            ),
            to: mapPos(error.line, error.character, state.doc),
            message: error.reason,
            source: error.evidence,
            severity: 'error',
          });
        }
      }
    }
    return found;
  };
}
