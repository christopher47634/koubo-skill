import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scripts"))
import align_subtitles  # noqa: E402


class TestAlignSubtitles(unittest.TestCase):
    def test_heavy_overlap_never_inverts_timestamps(self):
        # 原实现会算出 mid=1.75 导致第二条 start=1.77 > end=1.40（倒挂）
        subs = align_subtitles.build([
            ("第一句很长", 1.0, 2.5, None),
            ("第二句很短", 1.0, 1.4, None),
            ("第三句紧接", 1.5, 1.7, "Third line"),
        ])
        for i, s in enumerate(subs):
            self.assertEqual(s["index"], i)
            self.assertGreater(s["end"], s["start"])
            if i > 0:
                self.assertGreaterEqual(s["start"], subs[i - 1]["end"])
        self.assertEqual(subs[2]["en"], "Third line")

    def test_rejects_negative_empty_and_non_monotonic(self):
        with self.assertRaises(ValueError):
            align_subtitles.build([("负起点", -0.5, 1.0, None)])
        with self.assertRaises(ValueError):
            align_subtitles.build([("   ", 0.0, 1.0, None)])
        with self.assertRaises(ValueError):
            align_subtitles.build([("第二条更早", 2.0, 3.0, None), ("倒序", 1.0, 2.0, None)])


if __name__ == "__main__":
    unittest.main()
