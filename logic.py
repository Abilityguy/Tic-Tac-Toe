import random
from copy import deepcopy

# Basic Helper functions to track the board and calculate computer moves
class Game:
    def __init__(self, player = 'o', computer = 'x'):
        self.player = player
        self.computer = computer
        self.board = board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']

    # Returns a copy of the board to experiment on
    def board_copy(self):
        return deepcopy(self.board)
    
    # Returns true if a particular position in the board is empty
    def position_empty(self, pos):
        if(self.board[pos] == ' '):
            return True
        else:
            return False

    # Returns a list of possible moves
    def get_possible_moves(self):
        moves = []
        for i in range(len(self.board)):
            if(self.position_empty(i)): 
                moves.append(i)
        return moves

    # Returns true if the board is full
    def is_board_full():
        for i in range(0, len(self.board)):
            if(self.board[i] == ' '):
                return False
        return True

    # Returns the winning combination or returns False
    def has_won(self, board, mark):
        # Horizontal win
        if board[0] == board[1] and board[0] == board[2] and board[0] == mark:
            return [[0,1,2]]
        elif board[3] == board[4] and board[3] == board[5] and board[3] == mark:
            return [[3,4,5]]
        elif board[6] == board[7] and board[6] == board[8] and board[6] == mark:
            return [[6,7,8]]

        # Vertical Win
        elif board[0] == board[3] and board[0] == board[6] and board[0] == mark:
            return [[0,3,6]]
        elif board[1] == board[4] and board[1] == board[7] and board[1] == mark:
            return [[1,4,7]]
        elif board[2] == board[5] and board[2] == board[8] and board[2] == mark:
            return [[2,5,8]]

        # Diagonal Win
        elif board[0] == board[4] and board[0] == board[8] and board[0] == mark:
            return [[0,4,8]]
        elif board[2] == board[4] and board[2] == board[6] and board[2] == mark:
            return [[2,4,6]]
        else:
            return False

# Easy bot
#   Picks winning moves. 
#   Else, it makes random moves.
class Easy(Game):

    def calculate_move(self):
        
        moves = self.get_possible_moves()
        if(len(moves) == 0):
            return -1
        
        #Check for winning move
        for move in moves:
            board_copy = self.board_copy()
            board_copy[move] = self.computer
            if(self.has_won(board_copy,self.computer)):
                return move

        # Return a random move
        return random.choice(moves)


# Medium bot 
#   Picks winning moves. 
#   Blocks opponent's win opportunities.  
#   Else makes random moves
class Medium(Game):
    def calculate_move(self):
    
        moves = self.get_possible_moves()
        if(len(moves) == 0):
            return -1
        
        # Check for winning move
        for move in moves:
            board_copy = self.board_copy()
            board_copy[move] = self.computer
            if(self.has_won(board_copy,self.computer)):
                return move
        
        # Check if opponent can win next turn and block that move
        for move in moves:
            board_copy = self.board_copy()
            board_copy[move] = self.player
            if(self.has_won(board_copy,self.player)):
                return move

        # Return a random move
        return random.choice(moves)


# Hard bot
#   Picks winning moves. 
#   Blocks opponent's win opportunities. 
#   Else, makes selected moves based on game theory.
class Hard(Game):

    def calculate_move(self):

        moves = self.get_possible_moves()
        if(len(moves) == 0):
            return -1

        # Check for winning move
        for move in moves:
            board_copy = self.board_copy()
            board_copy[move] = self.computer
            if(self.has_won(board_copy,self.computer)):
                return move

        # Check if opponent can win next turn and block that move
        for move in moves:
            board_copy = self.board_copy()
            board_copy[move] = self.player
            if(self.has_won(board_copy,self.player)):
                return move

        corners = [0,2,6,8]
        middle = [4]
        other = [1,3,5,7]
        
        # Choose corners if possible
        moveset = list(set(corners).intersection(set(moves)))
        if(len(moveset) != 0):
            return random.choice(moveset)

        # Choose middle cell if corners are taken
        moveset = list(set(middle).intersection(set(moves)))
        if(len(moveset) != 0):
            return random.choice(moveset)

        # Make a choice from one of the remaining cells.
        moveset = list(set(other).intersection(set(moves)))
        return random.choice(moveset)

            
