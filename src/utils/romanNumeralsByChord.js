import * as Tone from 'tone';
import noteSample from '../samples/C4.wav';

export async function playChordFromRomanNumeral(romanNumeral) {
    // Ensure the audio context is started
    await Tone.start();
    Tone.Master.volume.value = -10;
    const pianoSamples = {
        "C5": noteSample,
    };

    const synth = new Tone.Sampler({
        urls: pianoSamples,
        release: 1,
    }).toDestination();

    
    /*
    // Define the chord mappings
    const chordMap = {
        // Natural Major Chords
        'I': ['C4', 'E4', 'G4'],
        'II': ['D4', 'F#4', 'A4'], // D major is not diatonic to C, but listed for completeness
        'III': ['E4', 'G#4', 'B4'], // E major
        'IV': ['F4', 'A4', 'C5'],
        'V': ['G4', 'B4', 'D5'],
        'VI': ['A4', 'C#5', 'E5'], // A major
        'VII': ['B4', 'D#5', 'F#5'], // B major

        // Natural Minor Chords (from A minor, relative minor of C major)
        'i': ['A3', 'C4', 'E4'],
        'ii': ['B3', 'D4', 'F4'],
        'iii': ['C4', 'E4', 'G4'],
        'iv': ['D4', 'F4', 'A4'],
        'v': ['E4', 'G4', 'B4'],
        'vi': ['F4', 'A4', 'C5'],
        'vii': ['G4', 'B4', 'D5'],

        // Sharp Alterations
        'I♯': ['C#4', 'E#4', 'G#4'],
        'II♯': ['D#4', 'G4', 'A#4'],
        'III♯': ['E#4', 'A4', 'B#4'], // Enharmonically F
        'IV♯': ['F#4', 'A#4', 'C#5'],
        'V♯': ['G#4', 'C5', 'D#5'],
        'VI♯': ['A#4', 'D5', 'F5'], // Enharmonically B♭
        'VII♯': ['B#4', 'E5', 'G#5'], // Enharmonically C

        'i♯': ['A#3', 'C#4', 'E#4'],
        'ii♯': ['B#3', 'D#4', 'F#4'], // Enharmonically C
        'iii♯': ['C#4', 'E#4', 'G#4'],
        'iv♯': ['D#4', 'F#4', 'A#4'],
        'v♯': ['E#4', 'G#4', 'B#4'], // Enharmonically F
        'vi♯': ['F#4', 'A#4', 'C#5'],
        'vii♯': ['G#4', 'B#4', 'D#5'], // Enharmonically A♭

        // Flat Alterations
        'I♭': ['Cb4', 'Eb4', 'Gb4'], // Enharmonically B
        'II♭': ['Db4', 'F4', 'Ab4'],
        'III♭': ['Eb4', 'G4', 'Bb4'],
        'IV♭': ['E4', 'G4', 'B4'], // Enharmonically F♭, listed as E for simplicity
        'V♭': ['Gb4', 'Bb4', 'Db5'],
        'VI♭': ['Ab4', 'C5', 'Eb5'],
        'VII♭': ['Bb4', 'D5', 'F5'],

        'i♭': ['G#3', 'B3', 'D#4'], // Enharmonically A♭
        'ii♭': ['A3', 'C4', 'Eb4'], // Enharmonically B♭♭, listed as A for simplicity
        'iii♭': ['Bb3', 'Db4', 'F4'],
        'iv♭': ['C4', 'Eb4', 'G4'],
        'v♭': ['Db4', 'F4', 'Ab4'],
        'vi♭': ['Eb4', 'G4', 'Bb4'],
        'vii♭': ['F4', 'Ab4', 'C5'],
    }; */

    const chordMap = {
        'I': ['C4', 'E4', 'G4'],
        'II': ['D4', 'F#4', 'A4'],
        'III': ['E4', 'G#4', 'B4'],
        'IV': ['F4', 'A4', 'C5'],
        'V': ['G4', 'B4', 'D5'],
        'VI': ['A4', 'C#5', 'E5'],
        'VII': ['B4', 'D#5', 'F#5'],

        // Sharps
        'I♯': ['C#4', 'E#4', 'G#4'],
        'II♯': ['D#4', 'G4', 'A#4'],
        'III♯': ['E#4', 'A4', 'B#4'],
        'IV♯': ['F#4', 'A#4', 'C#5'],
        'V♯': ['G#4', 'B#4', 'D#5'],
        'VI♯': ['A#4', 'D5', 'E#5'],
        'VII♯': ['B#4', 'E5', 'G5'],

        // Flats
        'I♭': ['Cb4', 'Eb4', 'Gb4'],
        'II♭': ['Db4', 'F4', 'Ab4'],
        'III♭': ['Eb4', 'G4', 'Bb4'],
        'IV♭': ['E4', 'G4', 'B4'], // EGB is a minor chord, corrected to: 'Fb4', 'Ab4', 'Cb5'
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

        // Sharps in C minor context (Theoretical, adjustments made for harmonic context)
        'i♯': ['C#4', 'E4', 'G#4'],
        'ii♯': ['D#4', 'F#4', 'A#4'],
        'iii♯': ['E4', 'G#4', 'B4'], // EGB is a minor chord, corrected to: 'E#4', 'G#4', 'B#4'
        'iv♯': ['F#4', 'A4', 'C#5'],
        'v♯': ['G#4', 'B4', 'D#5'],
        'vi♯': ['A#4', 'C#5', 'F5'],

        'vii♯': ['B#4', 'D#5', 'F#5'],

        // Flats
        'i♭': ['B3', 'D4', 'F4'],
        'ii♭': ['C#4', 'E4', 'G#4'],
        'iii♭': ['Db4', 'Eb4', 'Bb4'],
        'iv♭': ['D4', 'F4', 'A4'],
        'v♭': ['Gb4', 'A', 'Db4'],
        'vi♭': ['Ab4', 'B', 'Db4'],
        'vii♭': ['Bb4', 'Db4', 'F4']
    }

    // Convert input to the correct case for minor chords
    const key = romanNumeral.charAt(0) === romanNumeral.charAt(0).toLowerCase() ?
        romanNumeral.toLowerCase() :
        romanNumeral;

    // Find the chord in the map
    const chord = chordMap[key];

    if (chord) {
        // Play the chord
        Tone.loaded().then(() => {
            synth.triggerAttackRelease(chord, '0.75n');
        });
    } else {
        console.error('Chord not found for Roman numeral:', romanNumeral);
    }
}
