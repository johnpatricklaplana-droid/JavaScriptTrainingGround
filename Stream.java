
public class Stream {
    
    public static void main(String[] args) {
        
        int[] numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

        int target = 5;
        int index = binarySearch(target, numbers);

        System.out.println(index);

    }

    public static int binarySearch (int target, int[] numbers) {
       
        int end = numbers.length;
        int start = 0;

        while (end >= 0) { 
            int center = (end/2) + start;

            if(numbers[center] == target) {
                return center;
            } else if(numbers[center] > target) {
                end = center;
            } else {
                start = center;
            }
        }

        return -1;
    }

}
