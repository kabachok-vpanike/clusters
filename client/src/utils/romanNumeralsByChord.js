import * as Tone from 'tone';
import noteSample from '../samples/C4.wav';

export async function playChordFromRomanNumeral(romanNumeral) {
    await Tone.start();
    Tone.Master.volume.value = -10;
    const pianoSamples = {
        "C5": noteSample,
    };

    const synth = new Tone.Sampler({
        urls: pianoSamples,
        release: 1,
    }).toDestination();

    const chordMap = {
        'I': ['C4', 'E4', 'G4'],
        'II': ['D4', 'F#4', 'A4'],
        'III': ['E4', 'G#4', 'B4'],
        'IV': ['F4', 'A4', 'C5'],
        'V': ['G4', 'B4', 'D5'],
        'VI': ['A4', 'C#5', 'E5'],
        'VII': ['B4', 'D#5', 'F#5'],

        'I♯': ['C#4', 'E#4', 'G#4'],
        'II♯': ['D#4', 'G4', 'A#4'],
        'III♯': ['E#4', 'A4', 'B#4'],
        'IV♯': ['F#4', 'A#4', 'C#5'],
        'V♯': ['G#4', 'B#4', 'D#5'],
        'VI♯': ['A#4', 'D5', 'E#5'],
        'VII♯': ['B#4', 'E5', 'G5'],

        'I♭': ['Cb4', 'Eb4', 'Gb4'],
        'II♭': ['Db4', 'F4', 'Ab4'],
        'III♭': ['Eb4', 'G4', 'Bb4'],
        'IV♭': ['E4', 'G4', 'B4'], 
        'V♭': ['Gb4', 'Bb4', 'Db5'],
        'VI♭': ['Ab4', 'C5', 'Eb5'],
        'VII♭': ['Bb4', 'D5', 'F5'],

        'i': ['C4', 'Eb4', 'G4'],
        'ii': ['D4', 'F4', 'A4'],
        'iii': ['E4', 'G4', 'B4'],
        'iv': ['F4', 'Ab4', 'C5'],
        'v': ['G4', 'Bb4', 'D5'],
        'vi': ['A4', 'C5', 'E5'],
        'vii': ['B4', 'D5', 'F#5'],

        'i♯': ['C#4', 'E4', 'G#4'],
        'ii♯': ['D#4', 'F#4', 'A#4'],
        'iii♯': ['E4', 'G#4', 'B4'], 
        'iv♯': ['F#4', 'A4', 'C#5'],
        'v♯': ['G#4', 'B4', 'D#5'],
        'vi♯': ['A#4', 'C#5', 'F5'],

        'vii♯': ['B#4', 'D#5', 'F#5'],

        'i♭': ['B3', 'D4', 'F4'],
        'ii♭': ['C#4', 'E4', 'G#4'],
        'iii♭': ['Db4', 'Eb4', 'Bb4'],
        'iv♭': ['D4', 'F4', 'A4'],
        'v♭': ['Gb4', 'A', 'Db4'],
        'vi♭': ['Ab4', 'B', 'Db4'],
        'vii♭': ['Bb4', 'Db4', 'F4']
    }

    const key = romanNumeral.charAt(0) === romanNumeral.charAt(0).toLowerCase() ?
        romanNumeral.toLowerCase() :
        romanNumeral;

    const chord = chordMap[key];

    if (chord) {
        Tone.loaded().then(() => {
            synth.triggerAttackRelease(chord, '0.75n');
        });
    } else {
        console.error('Chord not found for Roman numeral:', romanNumeral);
    }
}
