// https://juejin.cn/post/6860273835074617358
// 冒泡排序
var sortArray = function(nums) {
  const { length } = nums;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - 1 - i; j++) {
      if (nums[j] > nums[j + 1]) {
        [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
      }
    }
  }
  return nums;
};

// 选择排序
var sortArray = function(nums) {
  const n = nums.length;
  for (let i = 0; i < n - 1; ++i) {
    let minIndex = i;
    for (let j = i + 1; j < n; ++j) {
      if (nums[minIndex] > nums[j]) {
        minIndex = j;
      }
    }
    [nums[i], nums[minIndex]] = [nums[minIndex], nums[i]];
  }
  return nums;
};

// 插入排序
var sortArray = function(nums) {
  const n = nums.length;
  for (let i = 1; i < n; ++i) {
    let j = i - 1;
    const tmp = nums[i];
    while (j >= 0 && tmp < nums[j]) {
      nums[j + 1] = nums[j];
      --j;
    }
    nums[j + 1] = tmp;
  }
  return nums;
};

// 希尔排序
var sortArray = function(nums) {
  const n = nums.length;
  for (let gap = n >> 1; gap > 0; gap >>= 1) {
    for (let i = 0; i < gap; ++i) {
      for (let j = i + gap; j < n; j += gap) {
        let preIndex = j - gap;
        const curNum = nums[j];
        while (preIndex >= 0 && curNum < nums[preIndex]) {
          nums[preIndex + gap] = nums[preIndex];
          preIndex -= gap;
        }
        nums[preIndex + gap] = curNum;
      }
    }
  }
  return nums;
};

// 堆排序
var sortArray = function(nums) {
  buildMaxHeap(nums);
  for (let i = nums.length - 1; i > 0; i--) {
    [nums[i], nums[0]] = [nums[0], nums[i]];
    maxHeapify(nums, 0, i);
  }
  return nums;
};
function buildMaxHeap(nums) {
  const n = nums.length;
  for (let i = n >> 1; i >= 0; i--) {
    maxHeapify(nums, i, n);
  }
}
function maxHeapify(nums, index, heapSize) {
  let largest = index;
  let l = index * 2 + 1;
  let r = l + 1;
  if (l < heapSize && nums[l] > nums[largest]) {
    largest = l;
  }
  if (r < heapSize && nums[r] > nums[largest]) {
    largest = r;
  }
  if (largest !== index) {
    [nums[largest], nums[index]] = [nums[index], nums[largest]];
    maxHeapify(nums, largest, heapSize);
  }
}

// 快速排序（分治）
var sortArray = function(nums) {
  quickSort(nums, 0, nums.length - 1);
  return nums;
};
function quickSort(nums, start, end) {
  if (start >= end) {
    return;
  }
  const mid = partition(nums, start, end);
  quickSort(nums, start, mid - 1);
  quickSort(nums, mid + 1, end);
}
function partition(nums, start, end) {
  const pivot = nums[start];
  let left = start + 1;
  let right = end;
  while (left < right) {
    while (left < right && nums[left] <= pivot) {
      left++;
    }
    while (left < right && nums[right] >= pivot) {
      right--;
    }
    if (left < right) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++;
      right--;
    }
  }
  if (left === right && nums[right] > pivot) {
    right--;
  }
  if (right !== start) {
    [nums[start], nums[right]] = [nums[right], nums[start]];
  }
  return right;
}

// 归并排序
var sortArray = function (nums) {
  const n = nums.length;
  if (n < 2) return nums;
  return mergeSort(nums);
};
function mergeSort(nums) { 
  const n = nums.length;
  if (n <= 1) {
    return nums;
  }
  const mid = n >> 1;
  return merge(mergeSort(nums.slice(0, mid)), mergeSort(nums.slice(mid)));
}
function merge(arr1, arr2) {
  const m = arr1.length;
  const n = arr2.length;
  let i = 0; 
  let j = 0;
  const ans = [];
  while (i < m && j < n) {
    if (arr1[i] < arr2[j]) {
      ans.push(arr1[i++]);
    } else {
      ans.push(arr2[j++]);
    }
  }
  while (i < m) {
    ans.push(arr1[i++]);
  }
  while (j < n) {
    ans.push(arr2[j++]);
  }
  return ans;
}
